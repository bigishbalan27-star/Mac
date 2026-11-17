#!/usr/bin/env python3
"""Quantize a Hugging Face causal LM with auto-round, then reload it to verify it works.

Usage:
    source .venv/bin/activate
    python scripts/quantize_model.py <model_name_or_path> [--bits 4] [--group_size 128] [--output_dir ./quantized-model]

Notes:
    - This environment has no GPU, so quantization runs on CPU. Expect a few
      minutes for small models (<=150M params) and 30+ minutes for medium
      models (300-500M params).
    - Saves in "fake" format: weights are dequantized back to full precision
      on disk. This is the format that reliably reloads with plain
      transformers.AutoModelForCausalLM.from_pretrained() on CPU-only setups
      (the native auto_round format needs CUDA-only backends like
      auto-gptq/gptqmodel to reload, which aren't installed here).
    - HF_HUB_DISABLE_XET=1 must be set before downloading models in this
      environment (the venv's activate script already sets it automatically).
"""

import argparse
import sys

from transformers import AutoModelForCausalLM, AutoTokenizer


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("model_name", help="Hugging Face model ID or local path")
    parser.add_argument("--bits", type=int, default=4, help="Target bit-width (default: 4)")
    parser.add_argument("--group_size", type=int, default=128, help="Quantization group size (default: 128)")
    parser.add_argument(
        "--output_dir", default="./quantized-model", help="Where to save the quantized model (default: ./quantized-model)"
    )
    parser.add_argument("--nsamples", type=int, default=128, help="Calibration samples (default: 128)")
    parser.add_argument("--iters", type=int, default=200, help="Tuning iterations per block (default: 200)")
    parser.add_argument(
        "--verify_prompt",
        default="The capital of France is",
        help="Prompt to run through the quantized model after saving, to confirm it reloads and generates",
    )
    args = parser.parse_args()

    from auto_round import AutoRound

    print(f"Loading {args.model_name} ...", flush=True)
    model = AutoModelForCausalLM.from_pretrained(args.model_name)
    tokenizer = AutoTokenizer.from_pretrained(args.model_name)

    print(
        f"Quantizing: bits={args.bits} group_size={args.group_size} "
        f"nsamples={args.nsamples} iters={args.iters}",
        flush=True,
    )
    ar = AutoRound(
        model,
        tokenizer,
        bits=args.bits,
        group_size=args.group_size,
        nsamples=args.nsamples,
        iters=args.iters,
    )
    ar.quantize()
    ar.save_quantized(args.output_dir, format="fake")
    print(f"Saved quantized model to {args.output_dir}", flush=True)

    print("Reloading to verify ...", flush=True)
    reloaded_tokenizer = AutoTokenizer.from_pretrained(args.output_dir)
    reloaded_model = AutoModelForCausalLM.from_pretrained(args.output_dir)

    inputs = reloaded_tokenizer(args.verify_prompt, return_tensors="pt")
    output_ids = reloaded_model.generate(**inputs, max_new_tokens=30, do_sample=False)
    output_text = reloaded_tokenizer.decode(output_ids[0], skip_special_tokens=True)

    print("Verification prompt: ", args.verify_prompt, flush=True)
    print("Verification output: ", output_text, flush=True)
    print("DONE.", flush=True)


if __name__ == "__main__":
    sys.exit(main())
