module.exports = {
    "rootDir": "ClientApp",
    "coverageDirectory": "<rootDir>/output/__coverage__/", // doesn't do anything for now.
    "moduleFileExtensions": ["ts", "tsx", "js", "jsx"],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "testRegex": ".*spec\\.(ts|tsx)$",
    "moduleDirectories": [
      "node_modules",
      "ClientApp" // jest doesn't support rooted import path by default. This way it doesn't throws error on ClientApp based imports.
    ],
    "setupFiles": [
      "<rootDir>/test.root.ts"
    ],
    "globals": {
      "MODE": "development"
    }
  }