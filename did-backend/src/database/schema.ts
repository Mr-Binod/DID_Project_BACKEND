

import { bigint } from 'drizzle-orm/gel-core';
import { integer } from 'drizzle-orm/pg-core';
import { pgTable, serial, text, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';


// Userinfo table
export const user = pgTable('user', {
  id: serial('id'),
  userName: varchar('userName', { length: 255 }),
  userId: varchar('userId', { length: 255 }).notNull().primaryKey(),
  nickName: varchar('nickName', { length: 255 }).notNull(),
  password: varchar('password', {length : 100}),
  birthDate: integer('birthDate').notNull(),
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
  adminId: varchar('email', { length: 255 }).notNull(),
  nickName: varchar('nickName', { length: 255 }).notNull(),
  password: varchar('password', {length : 100}),
  birthDate: integer('birthDate').notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  imgPath: varchar('imgPath', { length: 255 }),
  walletAddress: varchar('walletAddress', {length: 255}).notNull(),
  didAddress: varchar('didAddress', {length: 255}).notNull(),
  Role: varchar('role', { length: 255 }).notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  
});


export const VCprovider = pgTable('vcprovider', {
  id: serial('id'),
  userName: varchar('userName', {length: 255}).notNull(),
  userId: varchar('userId', {length: 255}).notNull(),
  certificateName: varchar('certificateName', {length: 255}).notNull(),
  issueDate: integer('issueDate').notNull(),
  event: varchar('event', {length: 255}).notNull(),
  description: varchar('description', {length: 255}).notNull(),

})

export const UserVC = pgTable('uservc', {
  id: serial('id'),
  userId: varchar('userId', {length: 255}).notNull(),
  certificateName: varchar('certificateName', {length: 255}).notNull(),
  didAddress: varchar('didAddress', {length: 255}).notNull(),
})

// DID table
export const dids = pgTable('dids', {
  id: serial('id').primaryKey(),
  did: varchar('did', { length: 255 }).notNull().unique(),
  address: varchar('address', { length: 42 }).notNull(),
  privateKey: text('private_key').notNull(),
  domain: varchar('domain', { length: 255 }),
  salt: varchar('salt', { length: 255 }),
  chainName: varchar('chain_name', { length: 50 }).default('sepolia'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// DID Documents table
export const didDocuments = pgTable('did_documents', {
  id: serial('id').primaryKey(),
  didId: serial('did_id').references(() => dids.id),
  document: text('document').notNull(), // JSON string of the DID document
  version: varchar('version', { length: 10 }).default('1.0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// DID Verification Methods table
export const verificationMethods = pgTable('verification_methods', {
  id: serial('id').primaryKey(),
  didId: serial('did_id').references(() => dids.id),
  type: varchar('type', { length: 50 }).notNull(), // 'Ed25519VerificationKey2020', 'EcdsaSecp256k1VerificationKey2019', etc.
  controller: varchar('controller', { length: 255 }).notNull(),
  publicKeyHex: text('public_key_hex'),
  publicKeyBase58: text('public_key_base58'),
  publicKeyJwk: text('public_key_jwk'), // JSON string
  createdAt: timestamp('created_at').defaultNow(),
});

// DID Services table
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  didId: serial('did_id').references(() => dids.id),
  type: varchar('type', { length: 100 }).notNull(),
  serviceEndpoint: text('service_endpoint').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});
