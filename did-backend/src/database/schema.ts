

import { bigint } from 'drizzle-orm/gel-core';
import { integer } from 'drizzle-orm/pg-core';
import { pgTable, serial, text, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';
import { id } from 'ethers';


// Userinfo table
export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  userName: varchar('userName', { length: 255 }),
  userId: varchar('userId', { length: 255 }).notNull().unique(),
  nickName: varchar('nickName', { length: 255 }).notNull(),
  password: varchar('password', {length : 100}),
  birthDate: varchar('birthDate').notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  imgPath: varchar('imgPath', { length: 255 }),
  walletAddress: varchar('walletAddress', {length: 255}).notNull(),
  didAddress: varchar('didAddress', {length: 255}).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const admin = pgTable('admin', {
  id: serial('id').primaryKey(),
  userName: varchar('name', { length: 255 }).notNull(),
  userId: varchar('userId', { length: 255 }).notNull().unique(),
  nickName: varchar('nickName', { length: 255 }).notNull(),
  password: varchar('password', {length : 100}),
  birthDate: varchar('birthDate', { length: 255 }).notNull(),
  // address: varchar('address', { length: 255 }).notNull(),
  grade: integer('grade').notNull().default(1),
  imgPath: varchar('imgPath', { length: 255 }),
  walletAddress: varchar('walletAddress', {length: 255}).notNull(),
  didAddress: varchar('didAddress', {length: 255}).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const adminRequest = pgTable('adminrequest', {
  id : serial('id').primaryKey(),
  userName: varchar('userName', { length: 255 }).notNull(),
  userId: varchar('userId', { length: 255 }).notNull().unique(),
  password: varchar('password', {length : 100}),
  nickName: varchar('nickName', { length: 255 }),
  birthDate: varchar('birthDate').notNull(),
  phoneNumber: varchar('phoneNumber', { length: 20 }).notNull(),
  grade: integer('grade').notNull().default(0),
  imgPath: varchar('imgPath', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const VcLogs = pgTable('vclogs', {
  id: serial('id').primaryKey(),
  userName: varchar('userName', {length: 255}).notNull(),
  userId: varchar('userId', {length: 255}).notNull().references(() => user.userId, {onDelete : 'cascade'}),
  certificateName: varchar('certificateName', {length: 255}).notNull(),
  issueDate: integer('issueDate').notNull(),
  description: varchar('description', {length: 255}).notNull(),
  issuerId: varchar('issuerId', {length: 255}).notNull(),
  request: varchar('request', {length: 255}).notNull(),
  status : varchar('status', {length: 255}).notNull().default('pending'),
})

export const UserVC = pgTable('uservc', {
  id: serial('id').primaryKey(),
  userId: varchar('userId', { length: 255 }).notNull().references(() => user.userId, {onDelete : 'cascade'}),
  userDidId: varchar('userDidId', { length: 255 }).notNull(),
  issuerId: varchar('issuerId', { length: 255 }).notNull(),
  issuerDidId: varchar('issuerDidId', { length: 255 }).notNull(),
  certificateName: varchar('certificateName', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
