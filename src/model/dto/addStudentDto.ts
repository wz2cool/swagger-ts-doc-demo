import { apiModelProperty, DataType } from "swagger-ts-doc";

export class AddStudentDto {
    @apiModelProperty(DataType.STRING, true, "学生姓名")
    public name: string;
    @apiModelProperty(DataType.INTEGER, true, "学生年龄")
    public age: number;
}
