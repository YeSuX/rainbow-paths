export default function Home() {
  return (
    <div className="pt-16">
      {" "}
      {/* 为导航栏留出空间 */}
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Hello World!</h1>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-3xl font-semibold">滚动查看导航栏效果</h2>
      </div>
    </div>
  );
}
