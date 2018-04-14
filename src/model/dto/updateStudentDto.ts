import { apiModelProperty, DataType } from "swagger-ts-doc";

export class UpdateStudentDto {
    @apiModelProperty(DataType.STRING, false, "学生姓名")
    public name: string;
    @apiModelProperty(DataType.INTEGER, false, "学生年龄")
    public age: number;
}
