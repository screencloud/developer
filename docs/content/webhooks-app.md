---
title: Webhooks App
---

# Setting Up the App Instance

Begin by installing the webhooks app from the Studio App store. Once you've named your instance, you'll get a unique webhook URL and an API key, both essential for sending webhook requests.

Here's what your unique webhook URL will look like:

```
https://apps-api-feeds.{region}.screencloudapps.com/v1/hooks/{uniqueId}
```

Your API key will be a 24-character alphanumeric string (to be determined), such as:

```
S8IjvxXE1x6PcwvmClcVfH6r
```

# Sending a Webhook Request

After obtaining your unique webhook URL and API key, you're all set to send your webhooks. You should `POST` all webhooks to your designated URL, including the API key within the `X-API-Key` header:

```shell
POST /v1/hooks/AnzLxehpCwCQFmggRhEm4xfuJh5xFvxV HTTP/1.1
Host: apps-api-feeds.eu.screencloudapps.com
X-API-Key: {API_KEY}
```

# Webhook Data Format

Ensure you send the content of your webhook in the JSON format within the request body to the specified URL. The structure of your data payload is crucial and should adhere to the following schema:

```json
{
  "items": [
    {
      "itemId": "12345",
      "dateCreated": "2024-02-01T12:00:00Z",
      "lastEditedTime": "2024-02-01T12:30:00Z",
      "messageUrl": "https://example.com/message/12345",
      "author": {
        "displayName": "John Doe",
        "profileImage": {
          "url": "https://example.com/profiles/johndoe.jpg"
        }
      },
      "content": {
        "title": {
          "content": "Sample Title"
        },
        "body": {
          "content": "This is a sample body content for the message."
        }
      },
      "attachments": [
        {
          "contentType": "image",
          "url": "https://example.com/images/sample.jpg"
        }
      ]
    }
  ]
}
```

## Webhook Params

| Name                      | Type       | Required | Description                                        |
| ------------------------- | ---------- | -------- | -------------------------------------------------- |
| `itemId`                  | `string`   | No       | You're own internal identifier.                    |
| `dateCreated`             | `string`   | No       | UTC date string item was created.                  |
| `lastEditedTime`          | `string`   | No       | UTC date string item was last edited.              |
| `messageUrl`              | `string`   | No       | Will generate a QR code to the message source URL. |
| `author.displayName`      | `string`   | No       | Display the author name.                           |
| `author.profileImage.url` | `string`   | No       | Display an author profile image.                   |
| `content.title.content`   | `string`   | No       | Title of the webhook post.                         |
| `content.body.content`    | `string`   | No       | Main body content of the webhook post.             |
| `attachments.url`         | `string[]` | No       | Accompanying image for thr webhook post.           |

> IMPORTANT: You must supply a `title`, `content` and/or `image`.

# Error Responses

TBC
