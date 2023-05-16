const StudentService = require("../../service/studentService");
const { readCsvWithPagination } = require("../../utils");
const z = require("zod");
const zodErrorSchema = z.object({
  code: z.string(),
  expected: z.string(),
  received: z.string(),
  path: z.array(),
  message: z.string(),
});
describe("getStudents", () => {
  it("should return a list of students in page two", async () => {
    // Arrange
    const pageSize = 2;
    const pageNumber = 2;
    let listOfStudents = [];
    readCsvWithPagination("students.csv", pageSize, pageNumber).then(
      (res) => (listOfStudents = res)
    );
    // Act
    const students = await StudentService.getStudents(pageSize, pageNumber);

    // Assert
    expect(students).toEqual(listOfStudents);
  });
});
describe("getStudents", () => {
  it("undefined params -> should return 10 first student in page one (default values)", async () => {
    // Arrange
    const pageSize = undefined;
    const pageNumber = undefined;
    let listOfStudents = [];
    readCsvWithPagination("students.csv", pageSize, pageNumber).then(
      (res) => (listOfStudents = res)
    );
    // Act
    const students = await StudentService.getStudents(pageSize, pageNumber);

    // Assert
    expect(students).toEqual(listOfStudents);
  });
});
describe("getStudents", () => {
  it("wrong params -> should error invalid type error", async () => {
    // Arrange
    const pageSize = "string";
    const pageNumber = "string";

    // Act

    const students = await StudentService.getStudents(pageSize, pageNumber);
    // Assert
    console.log("test ",students)
    expect(students).toEqual([])
  });
});
