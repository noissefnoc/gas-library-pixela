/**
 * @file pixe.la API basic Client
 * @author Kota SAITO <noissefnoc@gmail.com>
 * @version v3.0.0
 * @see {@link https://github.com/noissefnoc/gas-library-pixela}
 */

/**
 * pixe.la API basic Client<br/>
 * <p>
 * pixe.la API basic Client such as get, post, put and delete
 * internal use of Pixela_ class
 * </p>
 */
class Client_ {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public get(url: string): string {
    const headers = { "X-USER-TOKEN": this.token };
    const options = {
      method: "get",
      headers: headers,
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);

    return response.getContentText();
  }

  public post(url: string, payload: object): string {
    const headers = {
      "X-USER-TOKEN": this.token,
      "Content-Type": "application/json"
    };

    const options = {
      method: "post",
      payload: JSON.stringify(payload),
      headers: headers,
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);

    return response.getContentText();
  }

  public put(url: string, payload?: object): string {
    let headers = {
      "X-USER-TOKEN": this.token,
      "Content-Type": "application/json"
    };

    const options = {
      method: "put",
      payload: JSON.stringify(payload),
      headers: headers,
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);

    return response.getContentText();
  }

  public delete(url: string) {
    const headers = { "X-USER-TOKEN": this.token };

    const options = {
      method: "delete",
      headers: headers,
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);

    return response.getContentText();
  }
}
