/**
 * Common utility types
 */

export type HelloOptions = {
  name?: string;
  emoji?: boolean;
  uppercase?: boolean;
};

export type GreetingStyle = 'formal' | 'casual' | 'friendly';

export interface GreetingConfig {
  style: GreetingStyle;
  includeTime?: boolean;
  includeEmoji?: boolean;
}