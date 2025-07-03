// src/pages/teacher/highlights/StudentListPanel.jsx

const StudentListPanel = ({ students, selectedStudentId, onSelectStudent }) => {
  return (
    <div>
      <h4>학생 목록</h4>
      
      <ul className="student-list">
        {students.length === 0 ? (
          <li>학생이 없습니다.</li>
        ) : (
          students.map((s) => (
            <li
              key={s._id}
              onClick={() => onSelectStudent(s._id)}
              className={selectedStudentId === s._id ? 'selected' : ''}
            >
              {s.username} - {s.name}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default StudentListPanel;