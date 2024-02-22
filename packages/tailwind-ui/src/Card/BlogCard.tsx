export default function BlogCard() {
  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow">
      <img
        src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
        className="aspect-video w-full object-cover"
        alt=""
      />
      <div className="p-4">
        <p className="mb-1 text-sm text-primary-500">
          Andrea Felsted • <time>18 Nov 2022</time>
        </p>
        <h3 className="text-xl font-medium text-gray-900">Migrating to Sailboat UI</h3>
        <p className="mt-1 text-gray-500">
          Sailboat UI helps streamline software projects, sprints, tasks, and bug tracking.
        </p>
        <div className="mt-4 flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
            Design
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
            Product
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">
            Develop
          </span>
        </div>
      </div>
    </div>
  )
}
