/*
 * @Author: Akira
 * @Date: 2023-04-25 09:58:28
 * @LastEditTime: 2023-04-25 09:59:42
 */
import { io } from "socket.io-client";

export const socket = io("ws://localhost:3000");