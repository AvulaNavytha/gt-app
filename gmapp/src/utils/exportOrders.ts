import { utils, writeFile } from 'xlsx';
import { format } from 'date-fns';

export const exportOrders = (orders: any[], startDate: Date, endDate: Date) => {
  // Transform orders data for Excel
  const worksheetData = orders.map(order => ({
    'Order ID': order.id,
    'Customer Name': order.customerName,
    'Phone': order.customerPhone,
    'Seat Number': order.seatNumber,
    'Screen': order.screen,
    'Total Amount': order.total,
    'Status': order.status,
    'Payment ID': order.paymentId,
    'Created At': new Date(order.createdAt).toLocaleString(),
    'Completed At': order.completedAt ? new Date(order.completedAt).toLocaleString() : '',
    'Items': order.items.map((item: any) => 
      `${item.name} (${item.quantity}x ₹${item.price})`
    ).join(', ')
  }));

  // Create worksheet
  const worksheet = utils.json_to_sheet(worksheetData);

  // Create workbook
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Orders');
  var fileName = '';
  // Generate filename with date
  if(startDate != endDate){
    fileName = `orders_${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}.xlsx`;
  }
  else{
    fileName = `orders_${format(startDate, 'yyyy-MM-dd')}.xlsx`;
  }

  // Save file
  writeFile(workbook, fileName);
};