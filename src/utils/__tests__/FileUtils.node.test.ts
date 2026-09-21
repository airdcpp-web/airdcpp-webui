import { describe, expect, test } from 'vitest';
import {
  getFilePath,
  getFileName,
  isDirectory,
  getParentPath,
  getLastDirectory,
} from '../FileUtils';

describe('FileUtils', () => {
  describe('getFilePath', () => {
    test('should return path without filename', () => {
      expect(getFilePath('/dir/file.txt')).toBe('/dir/');
    });

    test('should return path unchanged for directory', () => {
      expect(getFilePath('/dir/subdir/')).toBe('/dir/subdir/');
    });
  });

  describe('getFileName', () => {
    test('should extract filename from full path', () => {
      expect(getFileName('/dir/file.txt')).toBe('file.txt');
    });

    test('should handle Windows paths', () => {
      expect(getFileName('C:\\dir\\file.txt')).toBe('file.txt');
    });

    test('should return empty for directory with trailing slash', () => {
      expect(getFileName('/dir/subdir/')).toBe('');
    });
  });

  describe('isDirectory', () => {
    test('should return true for paths ending with slash', () => {
      expect(isDirectory('/dir/')).toBe(true);
    });

    test('should return false for file paths', () => {
      expect(isDirectory('/dir/file.txt')).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(isDirectory('')).toBe(false);
    });
  });

  describe('getParentPath', () => {
    test('should return parent of directory', () => {
      expect(getParentPath('/dir/subdir/')).toBe('/dir/');
    });

    test('should return parent of file', () => {
      expect(getParentPath('/dir/subdir/file.txt')).toBe('/dir/subdir/');
    });
  });

  describe('getLastDirectory', () => {
    test('should return last directory name', () => {
      expect(getLastDirectory('/dir/subdir/')).toBe('subdir');
    });

    test('should return parent directory name for file', () => {
      expect(getLastDirectory('/dir/subdir/file.txt')).toBe('subdir');
    });

    test('should return full path for root-level file', () => {
      expect(getLastDirectory('/file.txt')).toBe('/file.txt');
    });
  });
});
