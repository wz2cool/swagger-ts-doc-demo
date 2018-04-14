import * as express from "express";
import * as lodash from "lodash";
import {
    DataType,
    HttpStatusCode,
    PathVariable,
    registerRequestMapping,
    RequestBody,
    RequestMethod,
    RequestParam,
    Response,
} from "swagger-ts-doc";
import { AddStudentDto } from "../model/dto/addStudentDto";
import { Student } from "../model/entity/student";

export class StudentApi {
    private students: Student[];
    constructor() {
        this.students = [];
    }

    public getRoute(): express.Router {
        const route = express.Router();

        registerRequestMapping(StudentApi, "/students", RequestMethod.POST,
            [
                new RequestBody("student", DataType.object, AddStudentDto, "新学生"),
            ],
            [
                new Response(HttpStatusCode.OK, DataType.string, "新学生ID"),
                new Response(HttpStatusCode.INTERNAL_SERVER_ERROR, DataType.string, "内部错误"),
                new Response(HttpStatusCode.CONFLICT, DataType.string, "学生姓名冲突"),
            ],
            "添加新学生");
        route.post("/", (req, res, next) => {
            if (!req.body.name) {
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR);
                res.json("学生姓名不能为空");
                return;
            }

            if (!req.body.age) {
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR);
                res.json("学生姓名不能为空");
                return;
            }

            if (lodash.findIndex(this.students, (x) => x.name === req.body.name) > -1) {
                res.status(HttpStatusCode.CONFLICT);
                res.json(`${req.body.name} 已经存在`);
                return;
            }

            const newOne = new Student();
            newOne.name = req.body.name;
            newOne.age = req.body.age;
            newOne.uuid = this.uuid();
            this.addStudent(newOne);
            res.status(HttpStatusCode.OK);
            res.json(newOne.uuid);
        });

        // registerRequestMapping(StudentApi, "/students/{id}", RequestMethod.DELETE, [
        //     new PathVariable("id", DataType.integer, "学生ID"),
        // ], new ResponseBody(DataType.string));
        // route.delete("/:id", (req, res, next) => {
        //     const id = req.params.id;
        //     this.deleteStudent(id);
        //     res.json("");
        // });

        // registerRequestMapping(StudentApi, "/students/{id}", RequestMethod.PUT, [
        //     new PathVariable("id", DataType.integer, "学生ID"),
        //     new RequestBody("student", DataType.object, Student, "学生"),
        // ], new ResponseBody(DataType.string));
        // route.put("/:id", (req, res, next) => {
        //     const id = req.params.id;
        //     const input = MappingProvider.toDtoObject<Student>(Student, req.body);
        //     input.id = id;
        //     this.modifyStudent(input);
        //     res.json("");
        // });

        // registerRequestMapping(
        //     StudentApi,
        //     "/students",
        //     RequestMethod.GET, [],
        //     new ResponseBody(DataType.array, Student, "return all students"));
        // route.get("/", (req, res, next) => {
        //     res.json(this.getStudents());
        // });

        return route;
    }

    public addStudent(newOne: Student): void {
        this.students.push(newOne);
    }

    // public deleteStudent(id: number): void {
    //     this.students = lodash.remove(this.students, (x: Student) => {
    //         return x.id === id;
    //     });
    // }

    // public modifyStudent(s: Student): void {
    //     this.students = lodash.remove(this.students, (x: Student) => {
    //         return x.id === s.id;
    //     });
    //     this.students.push(s);
    // }

    // public getStudents(): Student[] {
    //     return this.students;
    // }

    private uuid(): string {
        const s = [];
        const hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        const uuid = s.join("");
        return uuid;
    }
}
