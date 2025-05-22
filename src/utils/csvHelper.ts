import * as Papa from 'papaparse';

export const CSV_TEMPLATE_DATA = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        recipient_ethereum_address: '0x1234567890123456789012345678901234567890',
        position: 'Software Engineer',
        salary: '1000.000000'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        recipient_ethereum_address: '0x0987654321098765432109876543210987654321',
        position: 'Product Manager',
        salary: '2000.000000'
    }
];

export const downloadCsvTemplate = () => {
    const csv = Papa.unparse(CSV_TEMPLATE_DATA);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'recipients_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};