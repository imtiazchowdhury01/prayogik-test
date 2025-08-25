// @ts-nocheck

export default function Requirements({ course }) {
  return (
    <>
      {course.requirements.length === 0 ? (
        ""
      ) : (
        <div className="mt-12">
          <div className="my-6">
            <h1 className="text-2xl font-bold mb-4">Requirements</h1>
            <ul className="list-disc pl-6">
              {course.requirements.map((item, i) => (
                <li key={i} className="mb-2">
                  <span className="text-md">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
