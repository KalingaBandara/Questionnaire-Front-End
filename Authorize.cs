using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class AuthorizeMethod : MonoBehaviour
{
    InputField outputArea;
    public Button authorizeButton; // Reference to the authorize button
    public Button viewProfileButton; // Reference to the view profile button

    private string apiKey = "NjVkNDIyMjNmMjc3NmU3OTI5MWJmZGI0OjY1ZDQyMjIzZjI3NzZlNzkyOTFiZmRhYQ";
    private string jwtToken;


    void Start()
    {
        outputArea = GameObject.Find("OutputArea").GetComponent<InputField>();
        GameObject.Find("AuthorizeButton").GetComponent<Button>().onClick.AddListener(Authorize);
        GameObject.Find("ViewProfileButton").GetComponent<Button>().onClick.AddListener(ViewPlayerProfile);

    }

    void Authorize() => StartCoroutine(Authorize_Coroutine());
    void ViewPlayerProfile() => StartCoroutine(ViewProfile_Coroutine());

    IEnumerator Authorize_Coroutine()
    {
        outputArea.text = "Loading...";
        string url = "http://20.15.114.131:8080/api/login";

        // Create JSON request body with API key
        string requestData = "{\"apiKey\": \"" + apiKey + "\"}";


        using (UnityWebRequest request = UnityWebRequest.Post(url, new List<IMultipartFormSection> { new MultipartFormDataSection(requestData) }))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(requestData);
            request.uploadHandler = (UploadHandler)new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = (DownloadHandler)new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();
            if (request.result == UnityWebRequest.Result.ConnectionError || request.result == UnityWebRequest.Result.ProtocolError)
            {
                outputArea.text = request.error;
            }
            else
            {
                jwtToken = request.downloadHandler.text;
                outputArea.text = "Authorization successful. JWT token: " + jwtToken;
            }
        }
    }

    IEnumerator ViewProfile_Coroutine()
    {
        outputArea.text = "Fetching player profile...";
        string url = "http://20.15.114.131:8080/api/user/profile/view";

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            request.SetRequestHeader("Authorization", "Bearer " + jwtToken);

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.ConnectionError || request.result == UnityWebRequest.Result.ProtocolError)
            {
                outputArea.text = request.error;
            }
            else
            {
                string profileInfo = request.downloadHandler.text;
                outputArea.text = "Player profile: " + profileInfo;
                Debug.Log(profileInfo); // Output the profile information to the console

            }
        }
    }
}


