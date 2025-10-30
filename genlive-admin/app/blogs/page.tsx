import { FileEdit, Plus, Trash2 } from 'lucide-react';

// Dữ liệu mẫu
const mockBlogs = [
  { id: 'blog-001', title: 'Livestream đầu tiên của GenLive!', author: 'Admin', status: 'Published' },
  { id: 'blog-002', title:'Debut Starlight: Behind the Scenes', author: 'Linh Chi', status: 'Published' },
  { id: 'blog-003', title:'Kế hoạch Mùa Hè', author: 'Admin', status: 'Draft' },
];

export default function BlogManagementPage() {
  return (
    <div>
      {/* Header của trang */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Blogs</h1>
        <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={18} />
          <span>Viết bài mới</span>
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tiêu đề</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tác giả</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Trạng thái</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockBlogs.map((blog) => (
              <tr key={blog.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="font-medium text-gray-900">{blog.title}</span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{blog.author}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      blog.status === 'Published'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button className="mr-2 text-blue-600 hover:text-blue-800">
                    <FileEdit size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
