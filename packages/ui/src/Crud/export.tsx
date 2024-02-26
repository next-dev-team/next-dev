import { CloseCircleOutlined, DownloadOutlined } from '@ant-design/icons'
import {
  LightFilter,
  ProFormDatePicker,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components'
import { htmlPrint } from '@next-dev/utils'
import { Button, Form, Space, notification } from 'antd'
import DataTbl from '.'

type DataTable = React.ComponentProps<typeof DataTbl>

function convertToCSV(tableData: object[]): string {
  const headers = Object.keys(tableData[0]).join(',') + '\n'
  const rows = tableData
    .map((row) => {
      return Object.values(row)
        .map((value) => (typeof value === 'string' ? `"${value}"` : value))
        .join(',')
    })
    .join('\n')

  return headers + rows
}

function csvToBlob(csvData: string): Blob {
  const BOM = '\uFEFF'
  const csvBlob = new Blob([BOM + csvData], {
    type: 'text/csv;charset=utf-8;',
  })
  return csvBlob
}

function downloadBlobAsXLSX(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName + '.xlsx'
  link.click()
  URL.revokeObjectURL(url)
}

function exportTableToXLSX(tableData: object[], fileName = 'file'): void {
  const csvData = convertToCSV(tableData)
  const blob = csvToBlob(csvData)
  downloadBlobAsXLSX(blob, fileName)
}

export default function TblExport({ axios }: React.ComponentProps<typeof DataTbl>) {
  const [form] = Form.useForm()

  return (
    <Space>
      <LightFilter
        onFinish={async (values) => {
          const { type = 'pdf' } = values || {}
          if (type === 'pdf') {
            // alert("PDF export");
            setTimeout(() => {
              htmlPrint(document.getElementById('crud'))
            }, 500)
          } else if (type === 'xslx') {
            const response = await axios.get('/users', {
              params: {
                per_page: 100,
                ...values,
              },
            })
            const getVal = { data: [] }
            // state.dataSource = getVal?.data || [];
            if (Array.isArray(getVal?.data)) {
              exportTableToXLSX(getVal?.data, 'exportProps?.filename.xlsx')
              notification.success({
                message: 'Exported',
                description: 'Operation was successfully',
              })
            }
          } else if (type === 'csv') {
            alert('csv export')
          }
        }}
        form={form}
        footerRender={(onConfirm, onClear) => {
          const handleSubmit = (key: any) => {
            form.validateFields().then(() => {
              onConfirm?.()
            })
          }
          return (
            <div className="flex justify-between w-full">
              <Button onClick={onClear} shape="round" danger icon={<CloseCircleOutlined />}>
                Clear
              </Button>
              <Space size="small">
                <Button onClick={() => handleSubmit('pdf')} shape="round">
                  PDF
                </Button>
                <Button onClick={() => handleSubmit('csv')} shape="round">
                  CSV
                </Button>
                <Button onClick={() => handleSubmit('xslx')} shape="round">
                  Excel
                </Button>
              </Space>
            </div>
          )
        }}
        collapseLabel={<Button icon={<DownloadOutlined />}>Export</Button>}
        initialValues={{
          sex: 'man',
        }}
        collapse
      >
        <ProFormDatePicker name="birth" label="Created Date" width={'100%' as any} />
        <ProFormDatePicker name="birth1" label="Updated Date" width={'100%' as any} />
        <ProFormRadio.Group
          name="freq"
          label="Query frequency"
          rules={[{ required: true }]}
          options={[
            {
              value: 'weekly',
              label: 'weekly',
            },
            {
              value: 'quarterly',
              label: 'quarterly',
            },
            {
              value: 'monthly',
              label: 'monthly',
            },
            {
              value: 'yearly',
              label: 'every year',
            },
          ]}
        />
        <ProFormText hidden name="exportType" label="Export Type" />
      </LightFilter>
    </Space>
  )
}
