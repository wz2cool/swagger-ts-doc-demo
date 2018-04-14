import { apiModelProperty, DataType } from "swagger-ts-doc";

export class Student {
    @apiModelProperty(DataType.STRING, false, "学生ID")
    public uuid: string;
    @apiModelProperty(DataType.STRING, false, "学生姓名")
    public name: string;
    @apiModelProperty(DataType.STRING, false, "学生年龄")
    public age: number;
}
