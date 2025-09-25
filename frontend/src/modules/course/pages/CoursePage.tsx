export default function CoursePage() {
  return (
    <div className="bg-white shadow p-4 md:p-6 rounded-lg">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Khóa học</h1>
      <ul className="list-disc pl-4 md:pl-6 space-y-2">
        <li className="text-sm md:text-base">React Fundamentals</li>
        <li className="text-sm md:text-base">Spring Boot Backend</li>
        <li className="text-sm md:text-base">Database with MySQL</li>
      </ul>
    </div>
  );
}
