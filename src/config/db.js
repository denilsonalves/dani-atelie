module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "docker",
  database: "daniteste",
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
