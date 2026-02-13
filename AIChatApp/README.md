# AI 聊天 App 项目指南 (适合新手)

你好！既然你是编程小白，而且希望能**最快**看到可以在手机上运行的效果，我为你准备了两个方案。

由于你的电脑目前没有安装任何编程环境（Node.js, Flutter, Python 等），我们需要先迈出第一步。

## 方案一：使用 Flet (最推荐，最快上手)
**Flet** 是一个神奇的框架，它允许你用 **Python** 语言编写 App，底层却使用的是 **Flutter** 的技术。
这意味着：
1. 你只需要写简单的 Python 代码（我已经帮你写好了 `app.py`）。
2. 安装非常简单（比安装完整的 Flutter SDK 快得多）。
3. 它可以运行在 Windows 上，也可以打包成手机 App。

### 🚀 如何运行
1. **下载 Python**:
   访问 [python.org](https://www.python.org/downloads/) 下载并安装 Python (安装时记得勾选 **"Add Python to PATH"**)。

2. **安装 Flet**:
   打开你的终端（Terminal 或 CMD），输入以下命令：
   ```bash
   pip install flet
   ```

3. **运行 App**:
   在终端中进入本项目目录，运行：
   ```bash
   flet run app.py
   ```
   你会立刻看到一个漂亮的聊天窗口弹出！

---

## 方案二：使用原生 Flutter (专业路线)
如果你想深入学习移动开发，并最终发布到 App Store，Flutter 是最佳选择。但它的安装步骤较多。

### 🚀 如何开始
1. **下载 Flutter SDK**: 访问 [flutter.dev](https://flutter.dev/docs/get-started/install/windows) 下载。
2. **配置环境**: 你需要配置 Path 环境变量，并安装 Android Studio。
3. **创建项目**:
   ```bash
   flutter create my_chat_app
   ```
4. **复制代码**:
   将我为你准备的 `flutter_code_reference.dart` 中的代码，复制并覆盖到新项目中的 `lib/main.dart` 文件里。
5. **运行**:
   ```bash
   flutter run
   ```

## 📁 文件说明
- **`app.py`**: 基于 Flet 的完整聊天 App 代码。你运行这个就能立刻看到效果。
- **`flutter_code_reference.dart`**: 如果你以后安装了 Flutter，可以用这份代码作为基础。

## 🤖 下一步：接入真正的 AI
目前的 App 只是模拟回复。如果你想接入真正的 AI（比如 Gemini 或 ChatGPT）：
1. 去申请一个 API Key。
2. 修改 `app.py` 中的 `get_ai_response` 函数，调用 API 即可。
