require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.20",   // change from 0.8.4 to 0.8.20
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
