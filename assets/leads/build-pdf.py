"""Regenerate cloud-security-quickstart.pdf from the markdown source.

Usage:
    python3 assets/leads/build-pdf.py

Reads cloud-security-quickstart.md, renders a clean 1-page PDF with the
site's 3-color palette (surface, ink, accent).
"""

from pathlib import Path

from reportlab.lib.colors import Color
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.platypus import Frame, Paragraph, Spacer

HERE = Path(__file__).parent
OUTPUT = HERE / "cloud-security-quickstart.pdf"

# Three-color palette matching styles.css
SURFACE = Color(250 / 255, 250 / 255, 249 / 255)
INK = Color(10 / 255, 10 / 255, 10 / 255)
ACCENT = Color(161 / 255, 65 / 255, 255 / 255)
MUTED = Color(10 / 255, 10 / 255, 10 / 255, alpha=0.58)

TITLE_STYLE = ParagraphStyle(
    "title",
    fontName="Helvetica-Bold",
    fontSize=22,
    leading=26,
    textColor=INK,
    spaceAfter=4,
)
SUBTITLE_STYLE = ParagraphStyle(
    "subtitle",
    fontName="Helvetica-Bold",
    fontSize=12,
    leading=15,
    textColor=ACCENT,
    spaceAfter=8,
)
META_STYLE = ParagraphStyle(
    "meta",
    fontName="Helvetica",
    fontSize=8.5,
    leading=11,
    textColor=MUTED,
    spaceAfter=14,
)
SECTION_STYLE = ParagraphStyle(
    "section",
    fontName="Helvetica-Bold",
    fontSize=10,
    leading=12,
    textColor=ACCENT,
    spaceBefore=8,
    spaceAfter=4,
    letterSpacing=1.5,
)
ITEM_STYLE = ParagraphStyle(
    "item",
    fontName="Helvetica",
    fontSize=9.5,
    leading=13,
    textColor=INK,
    leftIndent=16,
    firstLineIndent=-16,
    spaceAfter=4,
)
BODY_STYLE = ParagraphStyle(
    "body",
    fontName="Helvetica",
    fontSize=9.5,
    leading=13,
    textColor=INK,
    spaceBefore=8,
    spaceAfter=4,
)
SIGNATURE_STYLE = ParagraphStyle(
    "sig",
    fontName="Helvetica-Oblique",
    fontSize=9.5,
    leading=13,
    textColor=MUTED,
    spaceBefore=4,
)


def numbered(n, text):
    return f'<font color="#A141FF"><b>{n:02d}.</b></font>&nbsp;&nbsp;{text}'


SECTIONS = [
    (
        "IDENTITY",
        [
            (1, "<b>Turn on MFA for the root / global admin account first.</b> "
                "Then never log in as root again. Create a personal admin user, "
                "hand the root password to a password manager, and walk away."),
            (2, "<b>One human, one identity.</b> No shared logins. Real names map "
                "to real accountability. Programmatic work uses a service "
                "principal / IAM role — never a human user's keys."),
            (3, "<b>Block long-lived access keys.</b> Use STS / federated identity "
                "/ managed identities. If a key has to exist, scope it tight and "
                "rotate it."),
        ],
    ),
    (
        "NETWORK",
        [
            (4, "<b>Private by default.</b> New resources land in a private "
                "subnet. Public exposure is a deliberate decision with a written "
                "reason."),
            (5, "<b>No 0.0.0.0/0 on management ports.</b> SSH, RDP, database "
                "ports — never open to the internet. Tunnel through SSM / "
                "Bastion / VPN."),
        ],
    ),
    (
        "DATA",
        [
            (6, "<b>Encrypt at rest, everywhere.</b> Default on the storage "
                "service. If you have to enable it manually, you're using "
                "something old."),
            (7, "<b>Block public buckets unless you can name the file.</b> "
                "S3 Block Public Access + Azure \"no anonymous\" — at the "
                "account level."),
        ],
    ),
    (
        "VISIBILITY",
        [
            (8, "<b>Turn on logging before you need it.</b> CloudTrail / "
                "Activity Log / VPC Flow Logs / NSG flow logs. Aggregate to "
                "one place. You can't investigate what you didn't record."),
            (9, "<b>Alert on root login, IAM changes, and security-group edits.</b> "
                "Three alerts catch most of the noisy stuff."),
        ],
    ),
    (
        "RECOVERY",
        [
            (10, "<b>One backup that isn't in the same account.</b> Cross-account "
                 "or cross-region copy. The blast radius of a compromised "
                 "account should not include your backups."),
        ],
    ),
]


def build():
    c = canvas.Canvas(str(OUTPUT), pagesize=LETTER)
    width, height = LETTER

    # Background
    c.setFillColor(SURFACE)
    c.rect(0, 0, width, height, stroke=0, fill=1)

    # Accent rule top
    c.setFillColor(ACCENT)
    c.rect(0.6 * inch, height - 0.55 * inch, 1.4 * inch, 4, stroke=0, fill=1)

    # Build flowables
    story = [
        Paragraph("Cloud Security Quick-Start", TITLE_STYLE),
        Paragraph("The 10 things to do before your first AWS or Azure deploy.",
                  SUBTITLE_STYLE),
        Paragraph(
            "A 1-page checklist by Kerry P. — Cloud, DevOps &amp; Security "
            "Engineer · Instructor at CyberTex Institute · Austin, TX",
            META_STYLE,
        ),
    ]

    for section, items in SECTIONS:
        story.append(Paragraph(section, SECTION_STYLE))
        for n, text in items:
            story.append(Paragraph(numbered(n, text), ITEM_STYLE))

    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "<b>What this is for.</b> This is the floor — not the ceiling. If you "
        "do these ten things you're ahead of most teams shipping their first "
        "cloud workload. After this, the conversation gets specific to your "
        "stack: compliance scope, IaC standards, secrets management, container "
        "hardening, observability.",
        BODY_STYLE,
    ))
    story.append(Paragraph(
        "If you want help going further, that's what I do. "
        "Reply to the email this came with, or visit "
        "<font color=\"#A141FF\">akplearner.github.io/#connect</font> "
        "to book a 20-minute briefing.",
        BODY_STYLE,
    ))
    story.append(Paragraph("— Kerry", SIGNATURE_STYLE))

    frame = Frame(
        0.7 * inch, 0.5 * inch,
        width - 1.4 * inch, height - 1.2 * inch,
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        showBoundary=0,
    )
    frame.addFromList(story, c)

    c.save()
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    build()
