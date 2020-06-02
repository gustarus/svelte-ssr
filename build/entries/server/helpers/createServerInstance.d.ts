/// <reference types="node" />
import http from 'http';
import { Express } from 'express';
export default function createServerInstance(server: Express, port: number | string, callback?: () => {}): http.Server;
