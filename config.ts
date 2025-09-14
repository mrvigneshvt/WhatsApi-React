export class Config {
  public static socketUrl = import.meta.env.URL || "http://localhost:3000";
  public static serverUrl = "http://localhost:3001";
  public static v1 = "/api/v1";
  public static v1BaseUrl = `${this.serverUrl}${this.v1}`;
  public static authentication = {
    login: this.v1BaseUrl + "/login",
    register: this.v1BaseUrl + "/register",
    validation: this.v1BaseUrl + "/validate",
  };
}
// \ ||
