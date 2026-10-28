import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();
    const status = searchParams.get('status')?.trim();
    const date = searchParams.get('date')?.trim();
    const exportCsv = searchParams.get('export') === 'csv';

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (date) {
      where.appointmentDate = date;
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { reference: { contains: search.toUpperCase() } },
        { customerEmail: { contains: search } },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: [
        { appointmentDate: 'desc' },
        { startTime: 'desc' },
      ],
    });

    // If CSV export requested:
    if (exportCsv) {
      const headers = [
        'Reference',
        'Customer Name',
        'Phone',
        'Email',
        'Date',
        'Start Time',
        'End Time',
        'Duration (Min)',
        'Total (BDT)',
        'Status',
        'Services',
        'Created At',
      ];

      const csvRows = [headers.join(',')];

      for (const a of appointments) {
        const services = JSON.parse(a.servicesSnapshot)
          .map((s: any) => `${s.name} (৳${s.price})`)
          .join('; ');

        const row = [
          `"${a.reference}"`,
          `"${a.customerName.replace(/"/g, '""')}"`,
          `"${a.customerPhone}"`,
          `"${a.customerEmail || ''}"`,
          `"${a.appointmentDate}"`,
          `"${a.startTime}"`,
          `"${a.endTime}"`,
          a.totalDuration,
          a.totalPrice,
          `"${a.status}"`,
          `"${services.replace(/"/g, '""')}"`,
          `"${a.createdAt.toISOString()}"`,
        ];
        csvRows.push(row.join(','));
      }

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="golden_cuts_appointments_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      appointments: appointments.map((a) => ({
        ...a,
        services: JSON.parse(a.servicesSnapshot),
      })),
    });
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve appointments' },
      { status: 500 }
    );
  }
}
