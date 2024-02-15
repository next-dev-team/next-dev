export default function CardBorderGradient({}: { children?: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-md rounded-lg bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 shadow-lg">
      <div className="bg-white p-7 rounded-md">
        <h1 className="font-bold text-xl mb-2">Border gradient example</h1>
        <p>Create beautfiul cards with gradient borders with Tailwind CSS.</p>
      </div>
    </div>
  )
}
