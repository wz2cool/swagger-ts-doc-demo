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
import { UpdateStudentDto } from "../model/dto/updateStudentDto";
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
                new RequestBody("student", DataType.OBJECT, AddStudentDto, "新学生"),
            ],
            [
                new Response(HttpStatusCode.OK, DataType.STRING, "新学生ID"),
                new Response(HttpStatusCode.INTERNAL_SERVER_ERROR, DataType.STRING, "内部错误"),
                new Response(HttpStatusCode.CONFLICT, DataType.STRING, "学生姓名冲突"),
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

        registerRequestMapping(StudentApi, "/students/{id}", RequestMethod.DELETE,
            [
                new PathVariable("id", DataType.STRING, "学生ID"),
            ],
            [
                new Response(HttpStatusCode.OK, DataType.STRING, "ok"),
                new Response(HttpStatusCode.INTERNAL_SERVER_ERROR, DataType.STRING, "内部错误"),
                new Response(HttpStatusCode.NOT_FOUND, DataType.STRING, "学生未找到"),
            ],
            "删除学生");
        route.delete("/:id", (req, res, next) => {
            const id = req.params.id;
            if (!id) {
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR);
                res.json("学生ID不能为空");
                return;
            }

            if (lodash.findIndex(this.students, (x) => x.uuid === id) < 0) {
                res.status(HttpStatusCode.NOT_FOUND);
                res.json(`未能找到学生`);
                return;
            }

            this.deleteStudent(id);
            res.json("ok");
        });

        registerRequestMapping(StudentApi, "/students/{id}", RequestMethod.PUT,
            [
                new PathVariable("id", DataType.STRING, "学生ID"),
                new RequestBody("student", DataType.OBJECT, UpdateStudentDto, "学生"),
            ],
            [
                new Response(HttpStatusCode.OK, DataType.STRING, "ok"),
                new Response(HttpStatusCode.INTERNAL_SERVER_ERROR, DataType.STRING, "内部错误"),
                new Response(HttpStatusCode.NOT_FOUND, DataType.STRING, "学生未找到"),
            ],
            "修改学生");
        route.put("/:id", (req, res, next) => {
            const input = req.body;
            const id = req.params.id;
            if (!id) {
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR);
                res.json("学生ID不能为空");
                return;
            }

            if (lodash.findIndex(this.students, (x) => x.uuid === id) < 0) {
                res.status(HttpStatusCode.NOT_FOUND);
                res.json(`未能找到学生`);
                return;
            }

            const student = new Student();
            student.uuid = id;
            student.name = input.name;
            student.age = input.age;
            this.modifyStudent(student);
            res.json("ok");
        });

        registerRequestMapping(StudentApi, "/students", RequestMethod.GET, [],
            [
                new Response(HttpStatusCode.OK, DataType.ARRAY, Student, "所有学生"),
            ],
            "获取所有学生");
        route.get("/", (req, res, next) => {
            res.json(this.getStudents());
        });

        return route;
    }

    public addStudent(newOne: Student): void {
        this.students.push(newOne);
    }

    public deleteStudent(id: string): void {
        const index = this.students.map((x) => x.uuid).indexOf(id);
        this.students.splice(index, 1);
    }

    public modifyStudent(s: Student): void {
        const matchStudent = lodash.find(this.students, (x) => x.uuid === s.uuid);
        matchStudent.name = s.name || matchStudent.name;
        matchStudent.age = s.age || matchStudent.age;
    }

    public getStudents(): Student[] {
        return this.students;
    }

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
