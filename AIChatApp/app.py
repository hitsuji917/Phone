import flet as ft
import time

def main(page: ft.Page):
    page.title = "AI Chat Assistant"
    page.theme_mode = ft.ThemeMode.LIGHT
    page.padding = 20

    # 聊天消息列表
    chat_list = ft.ListView(
        expand=True,
        spacing=10,
        auto_scroll=True,
    )

    # 模拟 AI 回复
    def get_ai_response(user_message):
        # 这里是模拟的 AI 回复。
        # 如果你想接入真正的 AI，可以使用 google.generativeai 或 openai 库。
        time.sleep(1) # 模拟思考时间
        return f"我收到了你的消息：'{user_message}'。\n这是一个模拟的回复。要接入真正的 AI，你需要配置 API Key。"

    # 发送消息的函数
    def send_message(e):
        if not new_message.value:
            return

        user_text = new_message.value
        new_message.value = "" # 清空输入框
        
        # 1. 添加用户消息
        chat_list.controls.append(
            ft.Row(
                [
                    ft.Container(
                        content=ft.Text(user_text, color=ft.colors.WHITE),
                        bgcolor=ft.colors.BLUE_500,
                        border_radius=10,
                        padding=10,
                        width=300, # 限制宽度
                    )
                ],
                alignment=ft.MainAxisAlignment.END, # 用户消息靠右
            )
        )
        page.update()

        # 2. 显示 "AI 正在输入..."
        loading_message = ft.Row(
            [
                ft.Container(
                    content=ft.Text("AI 正在思考...", color=ft.colors.BLACK),
                    bgcolor=ft.colors.GREY_200,
                    border_radius=10,
                    padding=10,
                )
            ],
            alignment=ft.MainAxisAlignment.START,
        )
        chat_list.controls.append(loading_message)
        page.update()

        # 3. 获取 AI 回复
        ai_reply = get_ai_response(user_text)

        # 4. 移除 loading，显示真正的回复
        chat_list.controls.remove(loading_message)
        chat_list.controls.append(
            ft.Row(
                [
                    ft.Container(
                        content=ft.Text(ai_reply, color=ft.colors.BLACK),
                        bgcolor=ft.colors.GREY_200,
                        border_radius=10,
                        padding=10,
                        width=300,
                    )
                ],
                alignment=ft.MainAxisAlignment.START, # AI 消息靠左
            )
        )
        page.update()
        new_message.focus()

    # 输入框
    new_message = ft.TextField(
        hint_text="输入你想说的话...",
        autofocus=True,
        shift_enter=True,
        min_lines=1,
        max_lines=5,
        expand=True,
        on_submit=send_message,
    )

    # 发送按钮
    send_button = ft.IconButton(
        icon=ft.icons.SEND_ROUNDED,
        tooltip="发送",
        on_click=send_message,
        icon_color=ft.colors.BLUE_500,
    )

    # 底部输入区域
    input_area = ft.Row(
        controls=[new_message, send_button],
        alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
    )

    # 将组件添加到页面
    page.add(
        ft.Container(
            content=chat_list,
            expand=True, # 让聊天列表占据剩余空间
            border=ft.border.all(1, ft.colors.GREY_300),
            border_radius=10,
            padding=10,
        ),
        ft.Container(
            content=input_area,
            padding=ft.padding.only(top=10),
        ),
    )

# 运行应用
ft.app(target=main)
