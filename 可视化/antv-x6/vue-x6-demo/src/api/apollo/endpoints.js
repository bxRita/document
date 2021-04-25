/*
 * FilePath: \src\api\apollo\endpoints.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-25 14:36:27
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import { services } from '@/settings'

/**
 * Base 模块 Graphql Endpoint
 */
export const baseEndpoint = services.graphql + 'base/'
/**
 * System 模块 Graphql Endpoint
 */
export const systemEndpoint = services.graphql + 'sys/'
