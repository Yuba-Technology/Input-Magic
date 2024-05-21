module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@assets/(.*)$": "<rootDir>/assets/$1"
    },
    transform: {
        "^.+\\.ts$": "ts-jest",
        "^.+\\.tsx$": "ts-jest",
        "^.+\\.js$": "babel-jest"
    }
};
