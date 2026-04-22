# 心情日记小程序 - API 接口文档

> 版本：v1.0.0 | 更新日期：2026-04-22

---

## 📚 目录

1. [接口规范](#1-接口规范)
2. [用户模块](#2-用户模块)
3. [心情记录模块](#3-心情记录模块)
4. [统计分析模块](#4-统计分析模块)
5. [AI 分析模块](#5-ai 分析模块)
6. [数据导出模块](#6-数据导出模块)
7. [设置模块](#7-设置模块)

---

## 1. 接口规范

### 1.1 基础信息

- **Base URL**: `https://api.mood-diary.com/v1`
- **Content-Type**: `application/json`
- **字符编码**: `UTF-8`

### 1.2 请求头

```http
Content-Type: application/json
Authorization: Bearer {token}  # 需要登录的接口
X-Device-ID: {deviceId}        # 设备唯一标识
X-Platform: mini Program       # 平台标识
```

### 1.3 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

**状态码说明**

| 状态码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录/Token 无效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 1.4 错误响应格式

```json
{
  "code": 400,
  "message": "参数错误：mood 不能为空",
  "data": null
}
```

---

## 2. 用户模块

### 2.1 用户注册

**接口地址**: `POST /auth/register`

**请求参数**:

```json
{
  "username": "user123",           // 用户名（必填，3-20位）
  "phone": "13800138000",          // 手机号（必填，11位）
  "password": "password123",       // 密码（必填，6-20位）
  "confirmPassword": "password123" // 确认密码（必填）
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "u_1234567890",
    "username": "user123",
    "phone": "13800138000",
    "createdAt": "2026-04-22T10:00:00Z"
  }
}
```

### 2.2 用户登录

**接口地址**: `POST /auth/login`

**请求参数**:

```json
{
  "loginName": "user123",    // 用户名或手机号（必填）
  "password": "password123"  // 密码（必填）
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "u_1234567890",
    "userInfo": {
      "username": "user123",
      "phone": "13800138000",
      "nickname": "用户朋友",
      "avatarUrl": "https://example.com/avatar.jpg"
    },
    "expiresIn": 7200
  }
}
```

### 2.3 微信登录

**接口地址**: `POST /auth/wechat/login`

**请求参数**:

```json
{
  "code": "0a1B2c3D4e5F6g7H8i9J",  // 微信登录 code（必填）
  "encryptedData": "C7FGOZ...",   // 加密数据（可选）
  "iv": "rL3yK..."                // 加密向量（可选）
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "u_1234567890",
    "userInfo": {
      "nickname": "用户朋友",
      "avatarUrl": "https://wx.qlogo.cn/mmhead/...",
      "isFirstLogin": true
    },
    "expiresIn": 7200
  }
}
```

### 2.4 获取用户信息

**接口地址**: `GET /user/profile`

**请求头**: 需要携带 `Authorization`

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": "u_1234567890",
    "username": "user123",
    "phone": "13800138000",
    "nickname": "用户朋友",
    "avatarUrl": "https://wx.qlogo.cn/mmhead/...",
    "gender": 1,
    "createdAt": "2026-04-01T10:00:00Z",
    "settings": {
      "aiAnalysisEnabled": false,
      "privacyLevel": "local",
      "dataSyncEnabled": false
    }
  }
}
```

### 2.5 更新用户信息

**接口地址**: `PUT /user/profile`

**请求头**: 需要携带 `Authorization`

**请求参数**:

```json
{
  "nickname": "新的昵称",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "userId": "u_1234567890",
    "nickname": "新的昵称",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

---

### 2.6 重置密码

**接口地址**: `POST /auth/reset-password`

**请求参数**:

```json
{
  "email": "user@example.com",  // 注册邮箱（必填）
  "captcha": "123456"           // 邮箱验证码（必填）
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "重置密码邮件已发送",
  "data": null
}
```

### 2.7 修改密码

**接口地址**: `PUT /auth/change-password`

**请求头**: 需要携带 `Authorization`

**请求参数**:

```json
{
  "oldPassword": "oldpassword123",  // 旧密码（必填）
  "newPassword": "newpassword123",  // 新密码（必填，6-20位）
  "confirmPassword": "newpassword123" // 确认新密码（必填）
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null
}
```

---

## 3. 心情记录模块

### 3.1 创建心情记录

**接口地址**: `POST /mood/records`

**请求头**: 需要携带 `Authorization`

**请求参数**:

```json
{
  "mood": "happy",              // 心情类型（必填）：happy|calm|anxious|tired|excited|custom
  "moodScore": 85,              // 心情评分 1-100（可选，自定义心情时必填）
  "content": "今天完成了一个重要项目，感觉很有成就感！",  // 感悟内容（可选）
  "tags": ["工作", "成就"],     // 标签（可选）
  "recordDate": "2026-04-22"    // 记录日期（可选，默认当天）
}
```

**心情类型枚举**:

| 值 | 说明 | 颜色 |
|---|------|-----|
| happy | 开心 | #FFD93D |
| calm | 平静 | #6BCB77 |
| anxious | 焦虑 | #FF6B6B |
| tired | 疲惫 | #A8A8A8 |
| excited | 兴奋 | #FF9F1C |
| custom | 自定义 | 用户自选 |

**响应示例**:

```json
{
  "code": 200,
  "message": "记录成功",
  "data": {
    "recordId": "r_9876543210",
    "mood": "happy",
    "moodScore": 85,
    "content": "今天完成了一个重要项目，感觉很有成就感！",
    "tags": ["工作", "成就"],
    "recordDate": "2026-04-22",
    "createdAt": "2026-04-22T17:30:00Z"
  }
}
```

### 3.2 获取心情记录列表

**接口地址**: `GET /mood/records`

**请求头**: 需要携带 `Authorization`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| startDate | string | 否 | 开始日期，格式：YYYY-MM-DD |
| endDate | string | 否 | 结束日期，格式：YYYY-MM-DD |
| mood | string | 否 | 心情类型过滤 |
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20，最大 50 |

**请求示例**: `GET /mood/records?startDate=2026-04-01&endDate=2026-04-30&page=1&pageSize=20`

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "recordId": "r_9876543210",
        "mood": "happy",
        "moodScore": 85,
        "content": "今天完成了一个重要项目，感觉很有成就感！",
        "tags": ["工作", "成就"],
        "recordDate": "2026-04-22",
        "createdAt": "2026-04-22T17:30:00Z"
      },
      {
        "recordId": "r_9876543209",
        "mood": "calm",
        "moodScore": 70,
        "content": "晚上读了半本书，很充实",
        "tags": ["阅读", "生活"],
        "recordDate": "2026-04-21",
        "createdAt": "2026-04-21T21:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

### 3.3 获取单条心情记录

**接口地址**: `GET /mood/records/{recordId}`

**请求头**: 需要携带 `Authorization`

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| recordId | string | 是 | 记录 ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "recordId": "r_9876543210",
    "mood": "happy",
    "moodScore": 85,
    "content": "今天完成了一个重要项目，感觉很有成就感！",
    "tags": ["工作", "成就"],
    "recordDate": "2026-04-22",
    "createdAt": "2026-04-22T17:30:00Z",
    "updatedAt": "2026-04-22T17:30:00Z"
  }
}
```

### 3.4 更新心情记录

**接口地址**: `PUT /mood/records/{recordId}`

**请求头**: 需要携带 `Authorization`

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| recordId | string | 是 | 记录 ID |

**请求参数**:

```json
{
  "mood": "excited",
  "content": "今天完成了一个重要项目，感觉超级棒！",
  "tags": ["工作", "成就", "突破"]
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "recordId": "r_9876543210",
    "mood": "excited",
    "content": "今天完成了一个重要项目，感觉超级棒！",
    "tags": ["工作", "成就", "突破"],
    "updatedAt": "2026-04-22T18:00:00Z"
  }
}
```

### 3.5 删除心情记录

**接口地址**: `DELETE /mood/records/{recordId}`

**请求头**: 需要携带 `Authorization`

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| recordId | string | 是 | 记录 ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### 3.6 获取今日记录

**接口地址**: `GET /mood/records/today`

**请求头**: 需要携带 `Authorization`

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "recordId": "r_9876543210",
    "mood": "happy",
    "moodScore": 85,
    "content": "今天完成了一个重要项目，感觉很有成就感！",
    "tags": ["工作", "成就"],
    "recordDate": "2026-04-22",
    "createdAt": "2026-04-22T17:30:00Z"
  }
}
```

**说明**: 如果今日没有记录，返回 `data: null`

---

## 4. 统计分析模块

### 4.1 获取月度心情概览

**接口地址**: `GET /statistics/monthly`

**请求头**: 需要携带 `Authorization`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| year | number | 是 | 年份，如 2026 |
| month | number | 是 | 月份，1-12 |

**请求示例**: `GET /statistics/monthly?year=2026&month=4`

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "year": 2026,
    "month": 4,
    "totalRecords": 22,
    "moodCalendar": [
      {"date": "2026-04-01", "mood": "happy", "moodScore": 80},
      {"date": "2026-04-02", "mood": "calm", "moodScore": 70},
      {"date": "2026-04-03", "mood": "happy", "moodScore": 85},
      {"date": "2026-04-04", "mood": "anxious", "moodScore": 40},
      {"date": "2026-04-05", "mood": "happy", "moodScore": 75},
      {"date": "2026-04-06", "mood": "calm", "moodScore": 65},
      {"date": "2026-04-07", "mood": "happy", "moodScore": 80},
      // ... 其他日期
    ],
    "moodDistribution": {
      "happy": 40,
      "calm": 30,
      "anxious": 15,
      "tired": 10,
      "excited": 5
    },
    "avgMoodScore": 72.5,
    "topTags": [
      {"tag": "工作", "count": 12},
      {"tag": "睡眠", "count": 8},
      {"tag": "运动", "count": 7},
      {"tag": "阅读", "count": 6},
      {"tag": "生活", "count": 5}
    ]
  }
}
```

### 4.2 获取心情趋势图数据

**接口地址**: `GET /statistics/trend`

**请求头**: 需要携带 `Authorization`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| startDate | string | 是 | 开始日期，格式：YYYY-MM-DD |
| endDate | string | 是 | 结束日期，格式：YYYY-MM-DD |

**请求示例**: `GET /statistics/trend?startDate=2026-04-01&endDate=2026-04-30`

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "startDate": "2026-04-01",
    "endDate": "2026-04-30",
    "trendData": [
      {"date": "2026-04-01", "moodScore": 80, "mood": "happy"},
      {"date": "2026-04-02", "moodScore": 70, "mood": "calm"},
      {"date": "2026-04-03", "moodScore": 85, "mood": "happy"},
      {"date": "2026-04-04", "moodScore": 40, "mood": "anxious"},
      {"date": "2026-04-05", "moodScore": 75, "mood": "happy"},
      {"date": "2026-04-06", "moodScore": 65, "mood": "calm"},
      {"date": "2026-04-07", "moodScore": 80, "mood": "happy"}
      // ... 其他日期
    ],
    "stats": {
      "avgScore": 72.5,
      "maxScore": 95,
      "minScore": 30,
      "totalDays": 30,
      "recordedDays": 22
    }
  }
}
```

### 4.3 获取关键词云数据

**接口地址**: `GET /statistics/tags`

**请求头**: 需要携带 `Authorization`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| startDate | string | 是 | 开始日期，格式：YYYY-MM-DD |
| endDate | string | 是 | 结束日期，格式：YYYY-MM-DD |
| limit | number | 否 | 返回数量，默认 20，最大 50 |

**请求示例**: `GET /statistics/tags?startDate=2026-04-01&endDate=2026-04-30&limit=20`

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "startDate": "2026-04-01",
    "endDate": "2026-04-30",
    "tags": [
      {"tag": "工作", "count": 12, "weight": 100},
      {"tag": "睡眠", "count": 8, "weight": 67},
      {"tag": "运动", "count": 7, "weight": 58},
      {"tag": "阅读", "count": 6, "weight": 50},
      {"tag": "生活", "count": 5, "weight": 42},
      {"tag": "休息", "count": 4, "weight": 33},
      {"tag": "压力", "count": 3, "weight": 25},
      {"tag": "心情", "count": 3, "weight": 25}
    ]
  }
}
```

**说明**: `weight` 为相对权重（0-100），用于前端词云大小渲染

---

## 5. AI 分析模块

### 5.1 生成月度 AI 总结

**接口地址**: `POST /ai/monthly-summary`

**请求头**: 需要携带 `Authorization`

**请求参数**:

```json
{
  "year": 2026,
  "month": 4,
  "includeSuggestions": true  // 是否包含建议（可选，默认 true）
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "summaryId": "s_1234567890",
    "year": 2026,
    "month": 4,
    "generatedAt": "2026-04-30T23:59:59Z",
    "summary": {
      "overview": "4 月份你共记录了 22 天的心情，整体心情指数为 72.5 分，处于较为积极的状态。",
      "highlights": [
        "上半月心情较为稳定，开心和平静占主导",
        "4 月 15 日达到本月最高心情指数 95 分",
        "工作是你本月出现频率最高的关键词"
      ],
      "concerns": [
        "4 月 4-6 日出现短暂焦虑期，建议关注工作压力",
        "疲惫感在月末有所增加，注意休息"
      ],
      "suggestions": [
        "保持运动习惯，这是你心情较好时的共同标签",
        "可以尝试在焦虑时进行深呼吸或冥想",
        "月末工作强度较大，建议适当安排休息时间"
      ],
      "moodTrend": "上升",
      "comparedToLastMonth": "较上月提升 5%"
    }
  }
}
```

### 5.2 获取 AI 总结历史

**接口地址**: `GET /ai/summaries`

**请求头**: 需要携带 `Authorization`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| year | number | 否 | 年份过滤 |
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 12 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "summaryId": "s_1234567890",
        "year": 2026,
        "month": 4,
        "generatedAt": "2026-04-30T23:59:59Z",
        "moodTrend": "上升",
        "avgScore": 72.5
      },
      {
        "summaryId": "s_1234567889",
        "year": 2026,
        "month": 3,
        "generatedAt": "2026-03-31T23:59:59Z",
        "moodTrend": "平稳",
        "avgScore": 68.2
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 12,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### 5.3 获取单条 AI 总结

**接口地址**: `GET /ai/summaries/{summaryId}`

**请求头**: 需要携带 `Authorization`

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "summaryId": "s_1234567890",
    "year": 2026,
    "month": 4,
    "generatedAt": "2026-04-30T23:59:59Z",
    "summary": {
      "overview": "4 月份你共记录了 22 天的心情，整体心情指数为 72.5 分，处于较为积极的状态。",
      "highlights": [...],
      "concerns": [...],
      "suggestions": [...],
      "moodTrend": "上升",
      "comparedToLastMonth": "较上月提升 5%"
    }
  }
}
```

---

## 7. 设置模块

### 7.1 获取用户设置

**接口地址**: `GET /settings`

**请求头**: 需要携带 `Authorization`

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "aiAnalysisEnabled": false,
    "privacyLevel": "local",
    "dataSyncEnabled": false,
    "reminderEnabled": false,
    "reminderTime": "21:00",
    "theme": "light"
  }
}
```

### 7.2 更新用户设置

**接口地址**: `PUT /settings`

**请求头**: 需要携带 `Authorization`

**请求参数**:

```json
{
  "aiAnalysisEnabled": true,
  "privacyLevel": "cloud",
  "dataSyncEnabled": true,
  "reminderEnabled": true,
  "reminderTime": "21:00",
  "theme": "light"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "设置已更新",
  "data": {
    "aiAnalysisEnabled": true,
    "privacyLevel": "cloud",
    "dataSyncEnabled": true,
    "reminderEnabled": true,
    "reminderTime": "21:00",
    "theme": "light"
  }
}
```

### 7.3 隐私级别说明

| 级别 | 说明 | 数据同步 |
|-----|------|---------|
| local | 本地模式 | 否 |
| cloud | 云同步模式 | 是 |

---

## 附录

### A. 本地存储方案（未登录状态）

小程序在未登录状态下使用本地存储，推荐方案：

```javascript
// 本地存储 key 命名规范
const STORAGE_KEYS = {
  MOOD_RECORDS: 'mood_records',      // 心情记录数组
  USER_SETTINGS: 'user_settings',    // 用户设置
  USER_INFO: 'user_info',            // 用户信息（昵称等）
  DRAFT_RECORD: 'draft_record'       // 草稿记录
}

// 数据结构示例
{
  "mood_records": [
    {
      "recordId": "local_1234567890",
      "mood": "happy",
      "moodScore": 85,
      "content": "今天心情不错",
      "tags": ["生活"],
      "recordDate": "2026-04-22",
      "createdAt": 1713772800000
    }
  ],
  "user_settings": {
    "aiAnalysisEnabled": false,
    "privacyLevel": "local"
  }
}
```

### B. 数据同步策略

登录后的数据同步流程：

1. 拉取云端数据：`GET /mood/records?startDate=2020-01-01`
2. 对比本地数据（按 `recordId` 或 `recordDate`）
3. 冲突解决策略：以云端数据为准
4. 上传本地新增记录：`POST /mood/records`

### C. 限流策略

| 接口类型 | 限流规则 |
|---------|---------|
| 普通接口 | 60 次/分钟/IP |
| 登录接口 | 10 次/分钟/IP |
| 导出接口 | 5 次/小时/User |
| AI 分析接口 | 3 次/小时/User |

---

> 文档完成 | 可交付开发 | 支持版本迭代
