'use client';

export interface FinancialPDFData {
  title: string;
  income: number;
  occupancy: number;
  nights: number;
  cancellations: number;
  occupancyLabel: string;
}

export type FinancialPeriod = 'daily' | 'weekly' | 'monthly';

const PERIOD_LABELS: Record<FinancialPeriod, string> = {
  daily: 'يومي',
  weekly: 'أسبوعي',
  monthly: 'شهري',
};

/**
 * Renders a styled HTML report off-screen, snapshots it with html2canvas, and
 * saves it as a PDF via jsPDF. Mirrors the legacy Vite implementation so the
 * output looks identical to what users had before.
 */
export async function downloadFinancialPDF(
  period: FinancialPeriod,
  data: FinancialPDFData,
): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-SA');
  const timeStr = now.toLocaleTimeString('ar-SA');

  const container = document.createElement('div');
  container.style.cssText =
    'position:absolute;left:-9999px;top:0;width:800px;padding:40px;background:#fff;font-family:Arial,Tahoma,sans-serif;direction:rtl;';
  container.innerHTML = `
    <div style="text-align:center;margin-bottom:30px;border-bottom:3px solid #1a1a2e;padding-bottom:20px;">
      <h1 style="font-size:26px;color:#1a1a2e;margin:0 0 8px;">التقارير المالية</h1>
      <p style="font-size:15px;color:#666;margin:0;">تقرير ${PERIOD_LABELS[period]} — ${dateStr}</p>
    </div>
    <h2 style="font-size:18px;color:#1a1a2e;margin:20px 0 12px;">${data.title}</h2>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#1a1a2e;color:#fff;">
          <th style="padding:12px 16px;text-align:right;border:1px solid #ddd;font-size:14px;">البيان</th>
          <th style="padding:12px 16px;text-align:right;border:1px solid #ddd;font-size:14px;">القيمة</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:#fff;">
          <td style="padding:12px 16px;border:1px solid #ccc;font-size:14px;color:#111;">الدخل / الإيرادات</td>
          <td style="padding:12px 16px;border:1px solid #ccc;font-size:14px;font-weight:bold;color:#111;">${data.income.toLocaleString()} ر.س</td>
        </tr>
        <tr style="background:#f0f0f0;">
          <td style="padding:12px 16px;border:1px solid #ccc;font-size:14px;color:#111;">${data.occupancyLabel}</td>
          <td style="padding:12px 16px;border:1px solid #ccc;font-size:14px;font-weight:bold;color:#111;">${data.occupancy}</td>
        </tr>
        <tr style="background:#fff;">
          <td style="padding:12px 16px;border:1px solid #ccc;font-size:14px;color:#111;">ليالي المبيعات</td>
          <td style="padding:12px 16px;border:1px solid #ccc;font-size:14px;font-weight:bold;color:#111;">${data.nights}</td>
        </tr>
        <tr style="background:#f0f0f0;">
          <td style="padding:12px 16px;border:1px solid #ccc;font-size:14px;color:#111;">الإلغاءات</td>
          <td style="padding:12px 16px;border:1px solid #ccc;font-size:14px;font-weight:bold;color:#111;">${data.cancellations}</td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top:30px;text-align:center;color:#555;font-size:11px;">
      <p style="margin:0;">تم إنشاء هذا التقرير تلقائياً بتاريخ ${dateStr} الساعة ${timeStr}</p>
    </div>
  `;

  document.body.appendChild(container);
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`financial_report_${period}_${now.toISOString().split('T')[0]}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
