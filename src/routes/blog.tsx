import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/store";
import { waLink, waMessage } from "@/lib/whatsapp";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Hair Care Blog — Sachin Family Salon" },
      { name: "description", content: "Honest advice on hair patches, wigs, bridal styling and everyday hair care from the stylists at Sachin Family Salon, Silvassa." },
      { property: "og:title", content: "Hair Care Blog — Sachin Family Salon" },
      { property: "og:description", content: "Honest advice on hair patches, wigs and everyday hair care." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPage,
});

type Post = {
  title: string;
  date: string;
  minutes: number;
  tag: string;
  excerpt: string;
  body: string[];
};

const posts: Post[] = [
  {
    title: "Hair Patch vs Hair Transplant: Which One Actually Suits You?",
    date: "12 Oct 2026",
    minutes: 5,
    tag: "Hair replacement",
    excerpt:
      "Both restore hair — but they suit very different people, budgets and timelines. Here is the honest comparison we give every client at the consultation table.",
    body: [
      "A hair transplant is a surgical procedure: follicles are moved from the back of your head to the thinning area. Results are permanent, but you wait 8–12 months for visible growth, the cost runs into lakhs, and the outcome depends heavily on your donor hair and the surgeon's skill.",
      "A hair patch (hair system) is non-surgical. We match a human-hair patch to your colour, density and hairline, then fix it with medical-grade tape or glue. You walk out the same evening with a full head of hair. There are no needles, no scars and no recovery period.",
      "Choose a transplant when you are young, have healthy donor hair and want a permanent, gradual solution. Choose a patch when you want results now, want to avoid surgery, have extensive baldness, or simply want to try the look before committing to anything permanent.",
      "At our Amli studio we never push one option. Come for a free sitting, see a patch fitted on you, and then decide. Many of our clients start with a patch and revisit the surgical question a few years later — with real hair on their head while they think.",
    ],
  },
  {
    title: "How to Care for a Human Hair Wig at Home (Without Ruining It)",
    date: "28 Sep 2026",
    minutes: 4,
    tag: "Wig care",
    excerpt:
      "A good wig lasts a year or more — if you wash it the way we show you. These are the five rules we repeat to every wig client.",
    body: [
      "Rule one: wash less than you think. A wig worn daily needs a gentle wash every 10–15 wears, not every day. Over-washing strips the cuticle and makes human hair dry and frizzy faster than anything else.",
      "Rule two: sulfate-free shampoo, cool water, and always stroke downwards — never rub or twist. Follow with a light conditioner from mid-length to ends, avoiding the cap and knots.",
      "Rule three: air-dry on a stand, never on a mannequin head (it stretches the cap) and never with high heat. If you must blow-dry, use low heat with a heat-protectant spray.",
      "Rule four: store it on a stand away from sunlight. Rule five: bring it to us every couple of months for a deep-conditioning and reshaping service — it is free for the first year on every wig bought from us, and it is the single biggest reason our clients' wigs keep looking new.",
    ],
  },
  {
    title: "Bridal Hair & Makeup: The Complete Silvassa Checklist",
    date: "15 Sep 2026",
    minutes: 6,
    tag: "Bridal",
    excerpt:
      "Booking bridal packages for the season? This is the exact timeline we walk through with every bride, from the first trial to the wedding morning.",
    body: [
      "Book your trial 3–4 weeks before the wedding. Bring your outfit fabric, jewellery and reference photos — matching the blouse neckline and dupatta drape to the hairstyle matters more than the hairstyle itself.",
      "Lock the morning-of timeline backwards from your muhurat. We schedule hair and makeup so the bride is camera-ready 90 minutes before photos begin, with buffer for touch-ups and last-minute outfit changes.",
      "For family functions, opt for lighter hairdos with sturdy pins — marathon sangeet evenings destroy elaborate structures. And always carry the touch-up kit we hand over: blotting sheets, lipstick, and the spare pins from your hairstyle.",
      "Our bridal packages include a paid trial, wedding-day hair and makeup, draping, and a companion service for a family member. Message us on WhatsApp with your wedding date to hold the slot — season dates fill fast.",
    ],
  },
  {
    title: "Monsoon Hair Care: 7 Habits That Actually Save Your Hair",
    date: "02 Sep 2026",
    minutes: 4,
    tag: "Seasonal care",
    excerpt:
      "Humidity frizzes natural hair and loosens patch tape alike. Here is how we adjust care routines — and fittings — every monsoon at the salon.",
    body: [
      "Habit one: dry your scalp fully after every wash. Humidity plus a damp scalp is the fastest route to dandruff and itch. Habit two: switch to a lighter, anti-frizz serum instead of heavy oils — heavy oil in monsoon traps moisture against the scalp.",
      "Habit three: never tie wet hair tight; the shaft swells and snaps. Habit four: wash your comb weekly. It is the most neglected item in every home we visit.",
      "For hair patch clients: the monsoon is tape season. Sweat loosens adhesive faster, so we tighten our re-tape cycle from 4–5 weeks to 3 weeks through July–September. If your hairline lifts after a wet trek, come in the same week — do not press it back yourself.",
      "Wig wearers: give the cap an extra day on the stand after washes, and carry a foldable stand if you travel. Damp caps stored in a bag smell and lose shape within a week.",
    ],
  },
  {
    title: "Choosing the Right Hair Colour and Density for Your Patch",
    date: "20 Aug 2026",
    minutes: 5,
    tag: "Hair replacement",
    excerpt:
      "The difference between a patch that fools everyone and one that whispers 'system' comes down to three choices: colour, density and hairline shape.",
    body: [
      "Colour: we always match your existing hair in daylight, under the salon's front windows — indoor lighting lies. If your sides are greying, we order a salt-and-pepper blend rather than a flat black, because a uniformly black patch next to grey sides is the number one giveaway.",
      "Density: beginners almost always ask for 130% density. Resist it. Natural adult hair is 90–110%; a slightly lighter patch blends with your sides and ages with you naturally.",
      "Hairline: a straight, dense hairline looks like a carpet. We prefer a slight recession and forward direction at the temples — the way real hairlines grow. This single choice makes the patch undetectable in photos.",
      "All three choices are part of your free consultation. We fit a sample on you, take a phone photo in daylight, and only order the system once you are convinced by the picture too.",
    ],
  },
  {
    title: "Hair Spa vs Oil Massage: What Actually Helps Hair Fall?",
    date: "05 Aug 2026",
    minutes: 4,
    tag: "Hair care",
    excerpt:
      "One is pampering, the other is tradition — but which one slows hair fall? Our senior stylists explain what each does and when we recommend it.",
    body: [
      "An oil massage improves blood flow to the scalp and conditions the hair shaft — but oil does not regrow hair, and leaving it overnight on a dandruff-prone scalp makes things worse. Two hours before your wash is plenty.",
      "A hair spa does three things a home routine cannot: a professional scalp cleanse that removes built-up sebum, a steamed deep-condition that repairs the mid-lengths, and a consultation that catches problems early.",
      "If your hair fall is seasonal stress or post-illness shedding, both help equally and the shedding usually settles on its own. If it is dandruff, hormones or diet, no spa will fix it — come in for a scalp check instead, and we will point you to the right treatment honestly.",
      "Our hair spa starts at ₹499 and includes a scalp analysis. Book through WhatsApp — weekend slots go first.",
    ],
  },
];

function BlogPage() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <SiteLayout>
      <section className="bg-secondary/60 py-14 text-center">
        <div className="mx-auto max-w-3xl px-5">
          <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">From the salon floor</p>
          <h1 className="mt-3 font-display text-5xl font-semibold text-accent md:text-6xl">
            Hair Care <span className="text-primary">Journal</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Honest advice from the stylists at Sachin Family Salon — the same things we tell you at the consultation table.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-8 px-5 py-16">
        {posts.map((post) => (
          <article key={post.title} className="rounded-2xl border border-border bg-card p-7 shadow-sm md:p-9">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1 text-[0.65rem] tracking-[0.14em] text-accent uppercase">{post.tag}</span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.minutes} min read</span>
            </div>
            <h2 className="mt-4 font-display text-3xl leading-tight md:text-4xl">{post.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{post.excerpt}</p>
            <div className="mt-5 space-y-4 border-t border-border pt-5">
              {post.body.map((p, i) => (
                <p key={i} className="text-[0.95rem] leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
            <a
              href={waLink(settings?.whatsapp, waMessage.general(settings?.salon_name))}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--whatsapp)] px-6 py-2.5 text-xs font-medium text-[color:var(--sand)]"
            >
              <MessageCircle className="size-3.5" /> Ask us about this on WhatsApp
            </a>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
