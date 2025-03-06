"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
require("reflect-metadata");
var dotenv_1 = __importDefault(require("dotenv"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var morgan_1 = __importDefault(require("morgan"));
var datasource_1 = require("./datasource");
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
datasource_1.AppDataSource.initialize()
    .then(function () {
    // here you can start to work with your database
    console.log("Database is connected");
})
    .catch(function (error) { return console.log(error); });
var options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
        },
    },
    apis: ['./src/routes/*.ts'],
};
var swaggerSpec = (0, swagger_jsdoc_1.default)(options);
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
var port = process.env.PORT || 3000;
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use("/api/", userRoutes_1.default);
app.get("/", function (req, res) {
    res.send("Express + TypeScript Server");
});
app.listen(port, function () {
    console.log("[server]: Server is running at http://localhost:".concat(port));
});
