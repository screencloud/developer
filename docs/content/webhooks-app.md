---
title: Webhooks App
metaDescription: Effortlessly set up and send webhooks with our comprehensive guide.
---

# Overview

The ScreenCloud Webhooks App allows you to send custom inputs to Studio, ensuring seamless integration with your on-screen design language. This guide will walk you through setting up and using the Webhooks App effectively.

# Setting Up the App Instance

To get started, install the Webhooks App from the Studio App Store. Once installed, create a new instance, provide a name for your webhook, and click the **Generate Webhook** button. This action generates a unique webhook URL and an API key, both of which are essential for sending webhook requests.

Your unique webhook URL will follow this format:

```
https://apps-api-feeds.{region}.screencloudapps.com/v1/hooks/{uniqueId}
```

Your API key will be a 24-character alphanumeric string, such as:

```
S8IjvxXE1x6PcwvmClcVfH6r
```

> **IMPORTANT:** Store your API key securely. You will not be able to view it again after leaving the page.

# Sending a Webhook Request

Once you have your webhook URL and API key, you can send webhook requests using an HTTP `POST` request. Include the API key in the `X-API-Key` header:

```http
POST /v1/hooks/816ce4d8-c0cc-476b-8121-33e600e0e33e HTTP/1.1
Host: apps-api-feeds.eu.screencloudapps.com
X-API-Key: S8IjvxXE1x6PcwvmClcVfH6r
Content-Type: application/json
```

## Webhook Data Format

Webhook data should be sent in JSON format in the request body. The payload structure should follow this schema:

```json
{
  "items": [
    {
      "itemId": "12345",
      "dateCreated": "2024-02-01T12:00:00Z",
      "lastEditedTime": "2024-02-01T12:30:00Z",
      "messageUrl": "https://example.com/message/12345",
      "author": {
        "displayName": "David Jones",
        "profileImage": {
          "url": "https://example.com/profiles/davidjones.jpg"
        }
      },
      "content": {
        "title": {
          "content": "Sample Title"
        },
        "body": {
          "content": "This is a sample body content for the hook."
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

## Webhook Parameters

| Name                      | Type            | Required | Description                                        |
| ------------------------- | --------------- | -------- | -------------------------------------------------- |
| `itemId`                  | `string`        | No       | Your own internal identifier.                      |
| `dateCreated`             | `string`        | No       | UTC date string indicating when the item was created. |
| `lastEditedTime`          | `string`        | No       | UTC date string indicating the last edit time.    |
| `messageUrl`              | `string`        | No       | Generates a QR code linking to the message source. |
| `author.displayName`      | `string`        | No       | Displays the author's name.                        |
| `author.profileImage.url` | `string`        | No       | Displays the author's profile image.               |
| `content.title.content`   | `string`        | No       | Title of the webhook post.                         |
| `content.body.content`    | `string`        | No       | Main body content of the webhook post.            |
| `attachments.contentType` | `image`, `link` | No       | Accepts `image` or `link` as valid content types. |
| `attachments.url`         | `string[]`      | No       | Image or link accompanying the webhook post.      |

> **Note:** You must provide at least one of the following fields: `content.title.content`, `content.body.content`, or `attachments.url`. Any combination of these fields is also acceptable.

# HTML Content in the Body

The `content.body.content` field supports basic HTML tags for formatting. For example:

```html
<p>This is a paragraph.</p>
```

### Supported HTML Tags

| HTML Tag                                          | Description       |
| ------------------------------------------------ | ----------------- |
| `<p>`                                            | Paragraph         |
| `<strong> / <b>`                                 | Bold              |
| `<em> / <i>`                                     | Italic            |
| `<u>`                                            | Underline         |
| `<s>`                                            | Strikethrough     |
| `<blockquote>`                                   | Quote             |
| `<ol>`                                           | Ordered list      |
| `<ul>`                                           | Unordered list    |
| `<li>`                                           | List item         |
| `<br>`                                           | Line break        |
| `<p><span class='bg-highlight'>Highlight</span></p>` | Highlight text    |
> If the content added in the body includes HTML but has tags not included in the list above, these tags will be omitted and only the content using the tags listed above will appear on screen.

# Display Formats

Below are examples showcasing various display formats your webhooks will adopt when they appear on screen. The layout may vary slightly based on the content of your webhook. These illustrations aim to provide an overview of potential layouts.

<details>
  <summary>Show full content screenshot</summary>

![full content post](./images/hook-all.png)

The example below demonstrates the simplest data structure you would `POST` to achieve the above result.

```json
{
  "items": [
    {
      "author": {
        "displayName": "David Jones",
        "profileImage": {
          "url": "https://example.com/profiles/davidjones.jpg"
        }
      },
      "content": {
        "title": {
          "content": "Welcome to our new London Office!"
        },
        "body": {
          "content": "We are excited to announce the opening of our new office in London. The new office is located in the heart of the city and will be the new home for our growing team. We ar elooking forward to welcoming our clients and partners to our new office."
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

</details>

<details>
  <summary>Show title only screenshot</summary>

![title only post](./images/hook-title-only-v2.png)

The example below demonstrates the simplest data structure you would `POST` to achieve the above result.

```json
{
  "items": [
    {
      "content": {
        "title": {
          "content": "Huge thanks to Emma for her hard work on the new project."
        }
      }
    }
  ]
}
```

</details>

<details>
  <summary>Show body only screenshot</summary>

![body only post](./images/hook-body-only-v2.png)

The example below demonstrates the simplest data structure you would `POST` to achieve the above result.

```json
{
  "items": [
    {
      "content": {
        "body": {
          "content": "Happy Anniversary to Richard. 2 years at the company today. Thanks for all your hard work!"
        }
      }
    }
  ]
}
```

</details>
<details>
  <summary>Show body (containing HTML) only screenshot</summary>

![body only post](./images/hook-body-only-with-html.png)

The example below demonstrates the simplest data structure you would `POST` to achieve the above result.

```json
{
  "items": [
    {
      "content": {
        "body": {
          "content": "<p><strong>We are excited to announce the opening of our new office in </strong><strong class=\"bg-highlight\">London</strong><strong>.</strong></p><br/><p>Home to a <span>diverse range of talented team members from:</span></p><ul><li>Marketing</li><li>Customer Success</li><li>Sales and Operations</li></ul><br/><p>We are looking forward to welcoming our clients and partners to our new office.</p>"
        }
      }
    }
  ]
}
```
</details>
<details>
  <summary>Show image and body (containing HTML) screenshot</summary>

![image and body with HTML post](./images/hook-image-body-with-html.png)

The example below demonstrates the simplest data structure you would `POST` to achieve the above result.

```json
{ 
  "items": [
    {
    "content": {
      "body": {
        "content": "<p><strong>We are excited to announce the opening of our new office in</strong><strong class=\"bg-highlight\">London</strong><strong>.</strong></p><p>The new office is located in the heart of the city and will be the new home for our growing team.</p><p>Home to a<span>diverse range of talented team members from:</span></p><ul><li>Marketing</li><li>Customer Success</li><li>Sales and Operations</li></ul><p>We are looking forward to welcoming our clients and partners to our new office.</p>",
      }
    },
    "attachments": [
      {"contentType": "image", "url": "https://example.com/images/sample.jpg"}
    ]
  }
  ]   
}
```

</details>
<details>
  <summary>Show image only screenshot</summary>

![image only post](./images/hook-image-only-v2.png)

The example below demonstrates the simplest data structure you would `POST` to achieve the above result.

```json
{
  "items": [
    {
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

</details>

<details>
  <summary>Show title and QR code screenshot</summary>

![title and QR code post](./images/hook-title-qr.png)

The example below demonstrates the simplest data structure you would `POST` to achieve the above result.

```json
{
  "items": [
    {
      "messageUrl": "https://example.com/some-page/",
      "content": {
        "title": {
          "content": "Huge thanks to Emma for her hard work on the new project."
        }
      }
    }
  ]
}
```

</details>
<details>
  <summary>Show title and link screenshot</summary>

![title and link post](./images/hook-title-link.png)
A large call to action QR Code represents the link. The user can scan the QR Code and they will be taken to the link.
The example below demonstrates the simplest data structure you would `POST` to achieve the above result.

```json
{
  "items": [
    {
      "content": {
        "title": {
          "content": "View the latest Health and Safety Information"
        }
      },
      "attachments": [
        {
          "contentType": "link",
          "url": "https://example.com/health-and-safety"
        }
      ]
    }
  ]
}
```

</details>
<details>
  <summary>Show link only screenshot</summary>

![title and link post](./images/hook-link-only.png)
A large call to action QR Code represents the link. The user can scan the QR Code and they will be taken to the link.
The example below demonstrates the simplest data structure you would `POST` to achieve the above result.

```json
{
  "items": [
    {
      "author": {
        "displayName": "Mike Smith"
      },
      "attachments": [
        {
          "contentType": "link",
          "url": "https://example.com/health-and-safety"
        }
      ]
    }
  ]
}
```

</details>

# Error Responses

Every error response you get from a webhook `POST` will be in the format outlined below. Essentially, you'll be given a list of all errors detected in your `POST` request. Receiving any error means the request has failed, and your webhook wasn't processed. Address the errors and attempt the request once more.

```json
{
  "messages": ["At least one of title, body, or attachment is required"]
}
```

## Invalid HTML content

When including HTML content in the body of a post, we'll verify the validity of the HTML. Should this verification fail, you'll be alerted that the HTML is invalid and the post will not be processed.

Here's how such a response would appear:

```json
{
  "success": false,
  "data": {
    "warning": {
      "message": "We were unable to post the following items due to the issues listed below. Please review the text and try again",
      "data": [
       {
          "itemId": "item-0003",
          "message": "Invalid text content in body",
        },
      ]
    }
  }
}
```

If there are several posts being sent and includes one post with invalid HTML, the other posts will be processed successfully but the post with invalid HTML will not be processed. 

Here's how such a response would appear:

```json
{
  "success": true,
  "data": {
    "warning": {
      "message": "We were unable to post the following items due to the issues listed below. Please review the text and try again",
      "data": [
       {
          "itemId": "item-0003",
          "message": "Invalid text content in body",
        },
      ]
    }
  }
}
```

## Problematic Attachments

When you include `attachments` with a specified `contentType` of `image`, we'll verify not just the URL's validity and existence, but also confirm that the content type matches an image. Should this verification fail, you'll be alerted that the attachment has been excluded from the post. The webhook post will proceed successfully; however, the invalid images will be omitted.

Here's how such a response would appear:

```json
{
  "success": true,
  "data": {
    "warning": {
      "message": "We were unable to access the following image attachment urls. These images have been removed from your post item. Please check the urls and try again",
      "data": [
        {
          "itemId": "item-0001",
          "url": "https://example.com/invalid-image.png"
        }
      ]
    }
  }
}
```

# Code Example

The example below demonstrates how to send a webhook using cURL. Just swap out the placeholders (like the URL and API key) with your own information gathered from the initial setup step to trigger the webhook.

```shell
curl --location 'https://apps-api-feeds.eu.screencloudapps.com/v1/hooks/816ce4d8-c0cc-476b-8121-33e600e0e33e' \
--header 'X-API-Key: S8IjvxXE1x6PcwvmClcVfH6r' \
--header 'Content-Type: application/json' \
--data '{"items":[{"itemId":"12345","dateCreated":"2024-02-01T12:00:00Z","lastEditedTime":"2024-02-01T12:30:00Z","messageUrl":"https://example.com/message/12345","author":{"displayName":"David Jones","profileImage":{"url":"https://example.com/profiles/davidjones.jpg"}},"content":{"title":{"content":"Sample Title"},"body":{"content":"This is a sample body content for the hook."}},"attachments":[{"contentType":"image","url":"https://example.com/images/sample.jpg"}]}]}'
```

# Testing Webhooks

To test your webhook integrations before deploying them, use tools like [Beeceptor](https://beeceptor.com/) or [Webhook.site](https://webhook.site/). These services help you inspect webhook requests, debug payloads, and simulate API calls without modifying your production system.

# Best Practices for Webhooks

- **Secure Your API Key:** Never expose your API key in public repositories or front-end code.
- **Validate Incoming Requests:** Ensure that webhook requests originate from ScreenCloud by verifying headers and payload signatures.
- **Use Retry Logic:** Implement retry mechanisms to handle temporary failures in webhook delivery.
- **Log Webhook Events:** Maintain logs for troubleshooting and debugging webhook requests.
- **Optimize Payload Size:** Avoid sending unnecessary data to keep requests lightweight and efficient.
- **Handle Webhook Failures Gracefully:** If your server is down, queue incoming webhooks for processing later.
