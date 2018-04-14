import { apiModelProperty, DataType } from "swagger-ts-doc";

export class UpdateStudentDto {
    @apiModelProperty(DataType.string, false, "学生姓名")
    public name: string;
    @apiModelProperty(DataType.integer, false, "学生年龄")
    public age: number;
}
