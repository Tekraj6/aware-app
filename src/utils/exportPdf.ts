import { jsPDF } from 'jspdf';
import {
  UserProfile,
  FeedbackEntry,
  JournalEntry,
  RealizationEntry,
} from '../storage/dataStore';
import { getRoleLabel } from '../constants/roles';
import { downloadFileToDevice, ExportResult } from './fileDownloader';

interface ExportData {
  profile: UserProfile | null;
  feedback: FeedbackEntry[];
  journal: JournalEntry[];
  realizations: RealizationEntry[];
}

export async function generateJohariPdf(data: ExportData): Promise<ExportResult> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const openEntries = data.feedback.filter((f) => f.quadrant === 'open');
  const blindspotEntries = data.feedback.filter((f) => f.quadrant === 'blindspot');
  const journalEntries = data.journal;
  const realizationEntries = data.realizations;

  const totalEntries =
    openEntries.length +
    blindspotEntries.length +
    journalEntries.length +
    realizationEntries.length;

  function checkPageBreak(requiredHeight: number) {
    if (y + requiredHeight > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  }

  function drawPageHeader() {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 155);
    doc.text('Aware — Johari Window Report', margin, 10);
    doc.setDrawColor(230, 230, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
  }

  // ==========================================
  // PAGE 1: TITLE BANNER & SUMMARY
  // ==========================================

  // Banner Background
  doc.setFillColor(74, 58, 255); // #4A3AFF Accent
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('AWARE', margin + 8, y + 12);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Johari Window Self-Awareness Report', margin + 8, y + 20);

  const userName = data.profile?.name || 'Explorer';
  const exportDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  doc.setFontSize(9);
  doc.setTextColor(230, 230, 255);
  doc.text(`Prepared for: ${userName}`, margin + 8, y + 29);
  doc.text(`Generated on: ${exportDate}`, margin + 8, y + 34);

  y += 44;

  // Stats Highlights Row
  const statBoxWidth = (contentWidth - 9) / 4;
  const statsList = [
    { label: 'Open Area', count: openEntries.length, color: [46, 125, 50], bg: [232, 245, 233] },
    { label: 'Blind Spot', count: blindspotEntries.length, color: [230, 81, 0], bg: [255, 243, 224] },
    { label: 'Hidden Area', count: journalEntries.length, color: [21, 101, 192], bg: [227, 242, 253] },
    { label: 'Unknown Area', count: realizationEntries.length, color: [106, 27, 154], bg: [243, 229, 245] },
  ];

  statsList.forEach((stat, i) => {
    const boxX = margin + i * (statBoxWidth + 3);
    doc.setFillColor(stat.bg[0], stat.bg[1], stat.bg[2]);
    doc.setDrawColor(stat.color[0], stat.color[1], stat.color[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(boxX, y, statBoxWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(stat.color[0], stat.color[1], stat.color[2]);
    doc.text(String(stat.count), boxX + statBoxWidth / 2, y + 9, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(stat.label, boxX + statBoxWidth / 2, y + 15, { align: 'center' });
  });

  y += 26;

  // 2x2 Johari Window Overview Grid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(26, 26, 46);
  doc.text('Johari Window Framework Overview', margin, y + 2);
  y += 6;

  const gridW = (contentWidth - 4) / 2;
  const gridH = 34;

  // 1. Open
  doc.setFillColor(232, 245, 233);
  doc.setDrawColor(200, 230, 205);
  doc.roundedRect(margin, y, gridW, gridH, 3, 3, 'FD');
  doc.setTextColor(46, 125, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('1. OPEN AREA', margin + 6, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Known to Self & Known to Others', margin + 6, y + 13);
  doc.setTextColor(70, 70, 80);
  doc.setFontSize(7.5);
  const openDesc = 'Strengths, recognized traits, and verified qualities shared with the world.';
  doc.text(doc.splitTextToSize(openDesc, gridW - 12), margin + 6, y + 19);

  // 2. Blind Spot
  const blindX = margin + gridW + 4;
  doc.setFillColor(255, 243, 224);
  doc.setDrawColor(255, 224, 178);
  doc.roundedRect(blindX, y, gridW, gridH, 3, 3, 'FD');
  doc.setTextColor(230, 81, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('2. BLIND SPOT', blindX + 6, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Unknown to Self & Known to Others', blindX + 6, y + 13);
  doc.setTextColor(70, 70, 80);
  doc.setFontSize(7.5);
  const blindDesc = 'Habits, blindspots, and patterns that others observe but you may overlook.';
  doc.text(doc.splitTextToSize(blindDesc, gridW - 12), blindX + 6, y + 19);

  y += gridH + 4;

  // 3. Hidden
  doc.setFillColor(227, 242, 253);
  doc.setDrawColor(187, 222, 251);
  doc.roundedRect(margin, y, gridW, gridH, 3, 3, 'FD');
  doc.setTextColor(21, 101, 192);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('3. HIDDEN AREA', margin + 6, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Known to Self & Unknown to Others', margin + 6, y + 13);
  doc.setTextColor(70, 70, 80);
  doc.setFontSize(7.5);
  const hiddenDesc = 'Private journal entries, unvoiced aspirations, vulnerabilities, and reflections.';
  doc.text(doc.splitTextToSize(hiddenDesc, gridW - 12), margin + 6, y + 19);

  // 4. Unknown
  doc.setFillColor(243, 229, 245);
  doc.setDrawColor(225, 190, 231);
  doc.roundedRect(blindX, y, gridW, gridH, 3, 3, 'FD');
  doc.setTextColor(106, 27, 154);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('4. UNKNOWN AREA', blindX + 6, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Unknown to Self & Unknown to Others', blindX + 6, y + 13);
  doc.setTextColor(70, 70, 80);
  doc.setFontSize(7.5);
  const unknownDesc = 'Breakthrough discoveries, latent potential, and unexpected revelations.';
  doc.text(doc.splitTextToSize(unknownDesc, gridW - 12), blindX + 6, y + 19);

  y += gridH + 10;

  // ==========================================
  // SECTION RENDERER HELPER
  // ==========================================

  function renderCategorySection(
    title: string,
    subtitle: string,
    accentRgb: [number, number, number],
    bgRgb: [number, number, number],
    items: Array<{
      header: string;
      body: string;
      badgeText: string;
      date: string;
    }>
  ) {
    checkPageBreak(30);

    // Section Header Banner
    doc.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
    doc.setDrawColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.text(`${title} (${items.length})`, margin + 6, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(90, 90, 100);
    doc.text(subtitle, margin + 6, y + 11);

    y += 18;

    if (items.length === 0) {
      checkPageBreak(16);
      doc.setFillColor(250, 250, 252);
      doc.setDrawColor(235, 235, 240);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'FD');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(140, 140, 155);
      doc.text('No entries recorded in this area yet.', margin + 8, y + 8);
      y += 16;
      return;
    }

    items.forEach((item) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const splitBody = doc.splitTextToSize(item.body, contentWidth - 14);
      const bodyLinesHeight = splitBody.length * 4.2;

      const cardHeight = 16 + bodyLinesHeight;
      checkPageBreak(cardHeight + 4);

      // Card Background
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(230, 230, 235);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'FD');

      // Left Accent Strip
      doc.setFillColor(accentRgb[0], accentRgb[1], accentRgb[2]);
      doc.roundedRect(margin, y, 2.5, cardHeight, 1, 1, 'F');

      // Badge (Role / Tag)
      doc.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
      const badgeWidth = Math.min(60, doc.getTextWidth(item.badgeText) + 8);
      doc.roundedRect(margin + 6, y + 4, badgeWidth, 5.5, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
      doc.text(item.badgeText, margin + 10, y + 8);

      // Date
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 160);
      const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      doc.text(formattedDate, pageWidth - margin - 6, y + 8, { align: 'right' });

      // Header / Question
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 45);
      doc.text(item.header, margin + 6, y + 14);

      // Body text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 75);
      doc.text(splitBody, margin + 6, y + 19);

      y += cardHeight + 4;
    });

    y += 4;
  }

  // ==========================================
  // RENDER 4 CATEGORIES
  // ==========================================

  // 1. OPEN AREA
  renderCategorySection(
    '1. Open Area',
    'Strengths & qualities recognized by both yourself and others',
    [46, 125, 50],
    [232, 245, 233],
    openEntries.map((e) => ({
      header: e.question,
      body: e.response,
      badgeText: getRoleLabel(e.role),
      date: e.date,
    }))
  );

  // 2. BLIND SPOT
  renderCategorySection(
    '2. Blind Spot',
    'Perspectives, habits, and observations noticed by others',
    [230, 81, 0],
    [255, 243, 224],
    blindspotEntries.map((e) => ({
      header: e.question,
      body: e.response,
      badgeText: getRoleLabel(e.role),
      date: e.date,
    }))
  );

  // 3. HIDDEN AREA
  renderCategorySection(
    '3. Hidden Area',
    'Private self-reflections, unvoiced aspirations, and honest thoughts',
    [21, 101, 192],
    [227, 242, 253],
    journalEntries.map((e) => ({
      header: e.prompt,
      body: e.content,
      badgeText: 'Private Reflection',
      date: e.date,
    }))
  );

  // 4. UNKNOWN AREA
  renderCategorySection(
    '4. Unknown Area',
    'Surprising realizations, breakthrough discoveries, and emerging sides of you',
    [106, 27, 154],
    [243, 229, 245],
    realizationEntries.map((e) => ({
      header: e.tag === 'self-discovered' ? 'Self-discovered Realization' : 'Pointed out by Someone',
      body: e.content,
      badgeText: e.tag === 'self-discovered' ? 'Self-discovered' : 'Others pointed out',
      date: e.date,
    }))
  );

  // Page Numbers Footer on all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 155);
    doc.text(
      `Aware — Johari Window Report | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Generate base64 data URI and save directly to device
  const pdfBase64 = doc.output('datauristring');
  return await downloadFileToDevice({
    filename: 'aware_johari_window_report.pdf',
    data: pdfBase64,
    mimeType: 'application/pdf',
    isBase64: true,
    title: 'Aware Johari Window PDF Report',
  });
}
