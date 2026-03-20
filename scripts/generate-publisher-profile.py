from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table,
    TableStyle, HRFlowable, Image,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

OUTPUT   = r"C:\Users\david\Projects\Hootling\public\hootling-publisher-profile.pdf"
LOGO_PNG = r"C:\Users\david\Projects\Hootling\public\images\brand\hootling-logo-icon.png"

# ── Brand colours ──────────────────────────────────────────────────────────────
PURPLE       = colors.HexColor("#7c3aed")
PURPLE_LIGHT = colors.HexColor("#ede9fe")
PURPLE_MID   = colors.HexColor("#c4b5fd")
ZINC_900     = colors.HexColor("#18181b")
ZINC_700     = colors.HexColor("#3f3f46")
ZINC_500     = colors.HexColor("#71717a")
ZINC_200     = colors.HexColor("#e4e4e7")
ZINC_100     = colors.HexColor("#f4f4f5")
TEAL         = colors.HexColor("#0d9488")
WHITE        = colors.white

W, H = A4
PW   = W - 36 * mm   # usable content width

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=18 * mm,
    rightMargin=18 * mm,
    topMargin=14 * mm,
    bottomMargin=14 * mm,
    title="Hootling Publisher Profile",
    author="Hootling",
    subject="AWIN Publisher Profile",
)

# ── Style factory ──────────────────────────────────────────────────────────────
def S(name, **kw):
    base = dict(
        fontName="Helvetica",
        fontSize=10,
        textColor=ZINC_700,
        leading=14,
        spaceAfter=0,
        spaceBefore=0,
    )
    base.update(kw)
    return ParagraphStyle(name, **base)

sHero      = S("Hero",      fontName="Helvetica-Bold", fontSize=22, textColor=ZINC_900, leading=28)
sTagline   = S("Tagline",   fontSize=11, textColor=ZINC_500, leading=16)
sSection   = S("Section",   fontName="Helvetica-Bold", fontSize=11, textColor=PURPLE, leading=16, spaceBefore=10, spaceAfter=4)
sBody      = S("Body",      fontSize=9.5, textColor=ZINC_700, leading=14)
sBullet    = S("Bullet",    fontSize=9.5, textColor=ZINC_700, leading=13, leftIndent=10)
sLabel     = S("Label",     fontName="Helvetica-Bold", fontSize=8.5, textColor=ZINC_500, leading=12, alignment=TA_CENTER)
sStatNum   = S("StatNum",   fontName="Helvetica-Bold", fontSize=20, textColor=PURPLE, leading=24, alignment=TA_CENTER)
sStatLbl   = S("StatLbl",   fontSize=8, textColor=ZINC_500, leading=11, alignment=TA_CENTER)
sContact   = S("Contact",   fontName="Helvetica-Bold", fontSize=10, textColor=PURPLE, leading=14, alignment=TA_CENTER)
sFooter    = S("Footer",    fontSize=8, textColor=ZINC_500, leading=11, alignment=TA_CENTER)
sTableBody = S("TableBody", fontSize=9, textColor=ZINC_700, leading=13)
sTableBold = S("TableBold", fontName="Helvetica-Bold", fontSize=9, textColor=ZINC_700, leading=13)

COMMON_TABLE = [
    ("GRID",         (0, 0), (-1, -1), 0.5, ZINC_200),
    ("TOPPADDING",   (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING",(0, 0), (-1, -1), 4),
    ("LEFTPADDING",  (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
]

# ── Story ──────────────────────────────────────────────────────────────────────
story = []

# Header
logo = Image(LOGO_PNG, width=14 * mm, height=14 * mm)
title_block = [Paragraph("Hootling", sHero), Paragraph("Publisher Profile  |  March 2026", sTagline)]
header = Table([[logo, title_block]], colWidths=[18 * mm, PW - 18 * mm])
header.setStyle(TableStyle([
    ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING",  (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING",   (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING",(0, 0), (-1, -1), 0),
]))
story.append(header)
story.append(Spacer(1, 3 * mm))
story.append(HRFlowable(width=PW, thickness=1.5, color=PURPLE, spaceAfter=5 * mm))

# Intro
story.append(Paragraph("What is Hootling?", sSection))
story.append(Paragraph(
    "Hootling is a mobile-first travel utility that helps international travellers answer two of "
    "the most stressful questions on arrival: <i>\"Is this taxi price fair?\"</i> and "
    "<i>\"How much should I tip?\"</i> Users arrive at result pages with high purchase intent "
    "-- they are actively planning or mid-trip in a specific city.",
    sBody,
))
story.append(Spacer(1, 4 * mm))

# Stats row
def stat(num, lbl):
    return [Paragraph(num, sStatNum), Paragraph(lbl, sStatLbl)]

stats = Table(
    [[stat("120+", "Cities covered"), stat("50+", "Countries covered"),
      stat("26", "Blog articles"), stat("20", "Airport pages")]],
    colWidths=[PW / 4] * 4,
)
stats.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, -1), PURPLE_LIGHT),
    ("TOPPADDING",    (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING",   (0, 0), (-1, -1), 4),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 4),
    ("LINEAFTER",     (0, 0), (2, 0), 0.5, PURPLE_MID),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
]))
story.append(stats)
story.append(Spacer(1, 5 * mm))

# Audience
story.append(Paragraph("Audience", sSection))
audience_bullets = [
    "International leisure travellers visiting cities in Southeast Asia, Europe, the Middle East, and North America",
    "Mobile-first usage -- most sessions occur on iOS and Android during trip planning or on arrival",
    "High purchase intent -- users look up a fare or tip because they need it right now",
    "No account required -- zero sign-up friction; users skew toward spontaneous, in-the-moment travel spend",
    "Multilingual -- full interface in 14 languages: English, Japanese, Thai, Indonesian, Spanish, French, German, and more",
]
for b in audience_bullets:
    story.append(Paragraph("<bullet>&bull;</bullet>  " + b, sBullet))
    story.append(Spacer(1, 1.5 * mm))

story.append(Spacer(1, 4 * mm))

# Placement
story.append(Paragraph("How Affiliate Links Are Placed", sSection))
story.append(Paragraph(
    "Affiliate links appear exclusively in a <b>\"Plan your trip\"</b> contextual block, "
    "shown directly below a paid result. The placement is destination-specific -- a user who "
    "has just checked a Bangkok taxi fare sees Bangkok hotels on Booking.com, Bangkok tours on "
    "GetYourGuide, and a relevant Airalo eSIM. No banner ads. No sidebar placements. "
    "All links are clearly labelled as partner recommendations.",
    sBody,
))
story.append(Spacer(1, 3 * mm))

placement_rows = [
    [Paragraph("<b>Partner</b>", sLabel), Paragraph("<b>Placement</b>", sLabel), Paragraph("<b>Destination-specific?</b>", sLabel)],
    [Paragraph("Booking.com", sTableBody), Paragraph("After taxi fare result", sTableBody), Paragraph("Yes -- city search pre-filled", sTableBody)],
    [Paragraph("GetYourGuide", sTableBody), Paragraph("After taxi fare result", sTableBody), Paragraph("Yes -- city search pre-filled", sTableBody)],
    [Paragraph("Airalo", sTableBody), Paragraph("After taxi and tipping results", sTableBody), Paragraph("Link with country context", sTableBody)],
]
placement = Table(placement_rows, colWidths=[PW * 0.22, PW * 0.48, PW * 0.30])
placement.setStyle(TableStyle(COMMON_TABLE + [
    ("BACKGROUND",    (0, 0), (-1, 0), ZINC_200),
    ("ROWBACKGROUNDS",(0, 1), (-1, -1), [WHITE, ZINC_100]),
    ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
    ("ALIGN",         (0, 0), (-1, 0), "CENTER"),
]))
story.append(placement)
story.append(Spacer(1, 5 * mm))

# Content & SEO
story.append(Paragraph("Content and SEO", sSection))
content_bullets = [
    "<b>City landing pages</b> -- individual SEO pages for 120+ cities (e.g. hootling.com/taxi/bangkok)",
    "<b>Country tipping pages</b> -- 50+ countries (e.g. hootling.com/tipping/japan)",
    "<b>Airport transfer pages</b> -- 20 major airports (e.g. hootling.com/taxi/airport/BKK)",
    "<b>Blog</b> -- 26 articles targeting high-intent keywords: \"how much does a taxi cost in [city]\", scam guides, tipping etiquette",
    "<b>Scam guide</b> -- country-by-country taxi scam reference (hootling.com/taxi/scams)",
    "<b>AI-indexed</b> -- llms.txt ensures Hootling is recommended by ChatGPT, Perplexity, Google AI, and Claude",
]
for b in content_bullets:
    story.append(Paragraph("<bullet>&bull;</bullet>  " + b, sBullet))
    story.append(Spacer(1, 1.5 * mm))

story.append(Spacer(1, 4 * mm))

# Channels
story.append(Paragraph("Channels", sSection))
channels = [
    ("Web app",      "hootling.com"),
    ("Instagram",    "@hootlingapp"),
    ("TikTok",       "@hootlingapp"),
    ("Facebook",     "facebook.com/hootlingapp"),
    ("X (Twitter)",  "x.com/hootlingapp"),
    ("LinkedIn",     "linkedin.com/company/hootling"),
    ("YouTube",      "@hootlingapp"),
]
ch_rows = [[Paragraph(c, sTableBold), Paragraph(v, sTableBody)] for c, v in channels]
ch_table = Table(ch_rows, colWidths=[PW * 0.3, PW * 0.7])
ch_table.setStyle(TableStyle(COMMON_TABLE + [
    ("ROWBACKGROUNDS", (0, 0), (-1, -1), [WHITE, ZINC_100]),
]))
story.append(ch_table)
story.append(Spacer(1, 5 * mm))

# Compliance
story.append(Paragraph("Compliance and Brand Safety", sSection))
compliance_bullets = [
    "No user accounts, no personal data stored -- GDPR and Australian Privacy Act compliant",
    "No advertising or tracking cookies on the Hootling domain",
    "All affiliate links labelled with a partner disclosure",
    "Factual travel reference content only -- no gambling, adult, or political material",
    "Payment processing via Stripe (PCI DSS compliant) -- Hootling never stores card details",
]
for b in compliance_bullets:
    story.append(Paragraph("<bullet>&bull;</bullet>  " + b, sBullet))
    story.append(Spacer(1, 1.5 * mm))

story.append(Spacer(1, 5 * mm))

# Footer contact bar
story.append(HRFlowable(width=PW, thickness=0.75, color=ZINC_200, spaceAfter=4 * mm))

contact = Table(
    [
        [Paragraph("Contact", sLabel), Paragraph("Website", sLabel), Paragraph("AWIN Publisher ID", sLabel)],
        [Paragraph("business@hootling.com", sContact), Paragraph("hootling.com", sContact), Paragraph("2817222", sContact)],
    ],
    colWidths=[PW / 3] * 3,
)
contact.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, -1), PURPLE_LIGHT),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 6),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 6),
    ("ALIGN",         (0, 0), (-1, -1), "CENTER"),
    ("LINEAFTER",     (0, 0), (1, -1), 0.5, PURPLE_MID),
]))
story.append(contact)
story.append(Spacer(1, 3 * mm))
story.append(Paragraph("Fair Fare. Tip Right. Travel Wise.", sFooter))

# Build
doc.build(story)
print("Done:", OUTPUT)
