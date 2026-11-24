# Auto reels: week of 23 Nov 2026

Three new reels, built fully automatically from photos in Dropbox (none used before), animated in Picsart: slow zoom, blurred background fill, colour grade, a bold title with a gold script line, and royalty-free Pixabay music baked in. Each is 1080x1920 and 12 to 13 seconds long.

| When (UK time) | Reel | Source | Music | Video |
|---|---|---|---|---|
| Wed 25 Nov, 17:30 | Thailand: the temple made entirely of wood | /thailand | Epic cinematic piano | https://gcdn.picsart.com/media-engine/0ca75c58-c137-4268-8d9a-af1af7b89aa8.mp4 |
| Fri 27 Nov, 17:30 | Amsterdam from the water | /Amstadam | Upbeat summer | https://gcdn.picsart.com/media-engine/b72462d0-2a07-48a4-a502-d465a4527451.mp4 |
| Sun 29 Nov, 17:30 | Indigo saree in an English garden | /New 2026 | Sitar loop | https://gcdn.picsart.com/media-engine/404864a3-591a-4884-b243-9ae3315f95c2.mp4 |

## Why these three
- **Thailand:** a "did you know" hook ("This temple is made entirely of wood"). Fact reels like this get saves and shares.
- **Amsterdam:** a "save this" travel tip reel, with a canal-ride call to action.
- **Saree:** Kerala-in-the-UK culture, the account's core niche. It ends on the question "Saree or salwar?" to start comments.

## Captions (5 hashtags each)
**Thailand**
> This temple is made entirely of wood 🤯🇹🇭
> The Sanctuary of Truth in Pattaya: every pillar, carving and spire hand-carved, and it's still being built, more than 40 years after work started in 1981.
> Thailand 2017, the trip before we became three 🤍
> Would you visit? 👇 Save this for your Thailand list 📌
> #Thailand #Pattaya #SanctuaryOfTruth #TravelThrowback #UKMallu

**Amsterdam**
> Amsterdam is best seen from the water 🛶🇳🇱
> Low bridges, crooked canal houses and Centraal Station from a boat seat. The easiest way to see the city in an hour.
> Family trip throwback ✨
> Have you done a canal ride yet? 👇 Save this for your trip 📌
> #Amsterdam #AmsterdamCanals #TravelThrowback #CityBreak #UKMallu

**Saree**
> Indigo saree, English garden, Kerala heart 💙
> A little sunshine, a lot of colour, and a garden for a runway.
> Her saree, my favourite view 🤍
> Saree or salwar, what's your go-to? 👇
> #Saree #IndigoSaree #MalayaliInUK #DesiInUK #UKMallu

## Automation
Each reel is a one-off scheduled task that posts it to Instagram through Windsor, checks it went live, and sends the link.
- Thailand: trig_01RsJH6YBnv7NocdBbkB9r2i
- Amsterdam: trig_01SzKFa8YDAEQT2HEa8Ld21N
- Saree: trig_01WZGVAwoGAcEVWJQ1o76uvu

To stop one, say "hold the Amsterdam reel" (for example) before it runs.

## Pipeline, for future weeks
Dropbox temporary link → Picsart upload → scene JSON (scratchpad wk/gen.py) → Picsart export → Windsor create_video_post.
