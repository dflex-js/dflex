const debug = require("debug")("instrument-cra");
const path = require("path");
const findYarnWorkspaceRoot = require("find-yarn-workspace-root");
const { throws } = require("assert");

const workspaceRoot = findYarnWorkspaceRoot() || process.cwd();
console.log("workspaceRoot", workspaceRoot);
const packagePath = path.resolve(workspaceRoot, "package.json");

let cypressWebpackConfigPath;
try {
  const package = require(packagePath);
  if (package.cypressWebpackConfigPath) {
    cypressWebpackConfigPath = package.cypressWebpackConfigPath;
  }
} catch {
  debug("failed to read package.json at path: %s", packagePath);
}

debug("finding webpack config %o", {
  workspaceRoot,
  cypressWebpackConfigPath,
});
const webpackConfigPath = cypressWebpackConfigPath
  ? path.resolve(workspaceRoot, path.normalize(cypressWebpackConfigPath))
  : path.resolve(
      workspaceRoot,
      "node_modules",
      "react-scripts",
      "config",
      "webpack.config.js"
    );

debug("path to react-scripts own webpack.config.js: %s", webpackConfigPath);

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const webpackFactory = require(webpackConfigPath);

function fakeConfig(envName) {
  // sometimes we do want to instrument the production code
  const instrumentProduction = process.env.CYPRESS_INSTRUMENT_PRODUCTION;
  const forced =
    instrumentProduction === "true" || instrumentProduction === "1";
  debug("checking the environment %o", {
    envName,
    instrumentProduction,
    forced,
  });
  if (envName !== "development") {
    if (!forced) {
      throw new Error(
        "Can overwrite cra webpack config only for development environment"
      );
    }
  }

  debug('calling real CRA webpack factory with env "%s"', envName);

  const config = webpackFactory(envName);

  // config.module.rules.forEach((oneOfrule, i) => {
  //   if (oneOfrule.oneOf) {
  //     oneOfrule.oneOf.forEach((rule, j) => {
  //       if (rule.test) {
  //         const str = rule.test.toString();

  //         if (/\js|mjs|jsx|ts|tsx/.test(str)) {
  //           if (config.module.rules[i].oneOf[j].options.plugins) {
  //             config.module.rules[i].oneOf[j].options.plugins.push(
  //               "babel-plugin-istanbul"
  //             );

  //             //           config.module.rules[i].oneOf[j].exclude={
  //             //   test: path.resolve(workspaceRoot,"node_modules"),
  //             //   exclude: [
  //             //     path.resolve(workspaceRoot,"node_modules","@dflex")
  //             //   ]
  //             // }
  //           }
  //         }
  //       }
  //     });
  //   }
  // });
  config.module.rules.forEach((oneOfRule, i) => {
    if (oneOfRule.oneOf) {
      oneOfRule.oneOf.forEach((rule, j) => {
        if (rule.test) {
          const str = rule.test.toString();

          if (/\js|mjs|jsx|ts|tsx/.test(str)) {
            if (config.module.rules[i].oneOf[j].options.plugins) {
              config.module.rules[i].oneOf[j].options.plugins.push([
                "babel-plugin-istanbul",
                {
                  all: true,
                  excludeNodeModules: false,
                  exclude: [],
                },
              ]);
            }
          }
        }
      });
    }
  });

  // console.log(path.resolve(workspaceRoot, "node_modules"));

  const newRule = {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    loader: path.resolve(workspaceRoot, "node_modules", "babel-loader"),
    exclude: [
      {
        test: path.resolve(workspaceRoot, "node_modules"),
        exclude: path.resolve(workspaceRoot, "node_modules", "dflex"),
      },
    ],
    options: {
      plugins: [
        [path.resolve(workspaceRoot, "node_modules", "babel-plugin-istanbul")],
      ],
    },
  };

  // config.module.rules.push(newRule);

  // console.log(config.module.rules[2].oneOf[1]);
  // throws.Error("");
  // config.module.rules.push({
  //   test: /\.js$/,
  //   exclude: {
  //     test: path.resolve(__dirname, "node_modules"),
  //     exclude: [
  //       path.resolve(__dirname, "node_modules/@dflex")
  //     ]
  //   },
  //      use: {
  //     loader: path.resolve("babel-loader"),
  //      options: {
  //       presets: ["babel-plugin-istanbul"]
  //      },
  //   },
  // })

  // TODO make the search more flexible
  // TODO pass resolved plugin, not just NPM module name
  // config.module.rules[2].oneOf[1].options.plugins.push('babel-plugin-istanbul')

  // console.log(workspaceRoot);
  //      config.module.rules.push({
  //      test: /\.js$/,
  //       exclude: {
  //         test: path.resolve(workspaceRoot, "node_modules"),
  //         exclude: [
  //           path.resolve(workspaceRoot, "node_modules/@dflex"),
  //         ]
  //       },
  //       loader: require.resolve('babel-plugin-istanbul')
  //  })

  return config;
}

// by sticking the proxied function into the require cache
// we ensure that when react-scripts start script loads it, we will get the
// returned webpack config, and will have a chance to add out plugin there
require.cache[webpackConfigPath].exports = fakeConfig;
