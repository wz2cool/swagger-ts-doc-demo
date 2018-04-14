import { apiModelProperty, DataType } from "swagger-ts-doc";

export class Student {
    @apiModelProperty(DataType.string, false, "学生ID")
    public uuid: string;
    @apiModelProperty(DataType.string, false, "学生姓名")
    public name: string;
    @apiModelProperty(DataType.string, false, "学生年龄")
    public age: number;
}
