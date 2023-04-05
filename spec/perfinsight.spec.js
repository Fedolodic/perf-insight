const { processFiles, processDirectory } = require('../index');
const fs = require('fs');
const path = require('path');

describe('PerfInsight CLI', () => {
  const testFilesPath = path.join(__dirname, 'test-files');
  const mockFiles = [
    {
      original: 'file1.js',
      temp: 'file1_temp.js',
    },
    {
      original: 'file2.js',
      temp: 'file2_temp.js',
    },
    {
      original: 'file3.js',
      temp: 'file3_temp.js',
    },
  ];

  function createMockFilesAndFolders() {
    if (!fs.existsSync(testFilesPath)) {
      fs.mkdirSync(testFilesPath);
    }
    mockFiles.forEach(({ original, temp }) => {
      const originalPath = path.join(testFilesPath, original);
      const tempPath = path.join(testFilesPath, temp);

      if (fs.existsSync(originalPath)) {
        const content = fs.readFileSync(originalPath, 'utf-8');
        fs.writeFileSync(tempPath, content, { flag: 'w' });
      }
    });
  }

  function deleteMockFilesAndFolders() {
    mockFiles.forEach(({ temp }) => {
      const tempPath = path.join(testFilesPath, temp);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    });
  }

  beforeEach(() => {
    createMockFilesAndFolders();
  });

  describe('processFiles', () => {
    it('should add performance marks and measures to selected files', () => {
      processFiles([path.join(testFilesPath, 'file1_temp.js')], 'add', {});

      const content = fs.readFileSync(path.join(testFilesPath, 'file1_temp.js'), 'utf-8');
      expect(content).toContain('performance.mark');
      expect(content).toContain('performance.measure');
    });

    it('should remove performance marks and measures from selected files', () => {
      processFiles([path.join(testFilesPath, 'file1_temp.js')], 'add', {});
      processFiles([path.join(testFilesPath, 'file1_temp.js')], 'remove', {});

      const content = fs.readFileSync(path.join(testFilesPath, 'file1_temp.js'), 'utf-8');
      expect(content).not.toContain('performance.mark');
      expect(content).not.toContain('performance.measure');
    });

    it('should ignore files specified in the configuration', () => {
      const config = {
        ignore: [path.join(testFilesPath, 'file1_temp.js')], // Change from 'file1.js' to 'file1_temp.js'
      };
    
      processFiles([
        path.join(testFilesPath, 'file1_temp.js'),
        path.join(testFilesPath, 'file2_temp.js'),
      ], 'add', config);
    
      const content1 = fs.readFileSync(path.join(testFilesPath, 'file1_temp.js'), 'utf-8');
      expect(content1).not.toContain('performance.mark');
      expect(content1).not.toContain('performance.measure');
    
      const content2 = fs.readFileSync(path.join(testFilesPath, 'file2_temp.js'), 'utf-8');
      expect(content2).toContain('performance.mark');
      expect(content2).toContain('performance.measure');
    });    
  });

  describe('processDirectory', () => {
    it('should add performance marks and measures to all files in a directory', () => {
      processDirectory(testFilesPath, 'add');

      mockFiles.forEach((file) => {
        const content = fs.readFileSync(path.join(testFilesPath, file.temp), 'utf-8');
        expect(content).toContain('performance.mark');
        expect(content).toContain('performance.measure');
      });
    });

    it('should remove performance marks and measures from all files in a directory', () => {
      processDirectory(testFilesPath, 'add');
      processDirectory(testFilesPath, 'remove');

      mockFiles.forEach((file) => {
        const content = fs.readFileSync(path.join(testFilesPath, file.temp), 'utf-8');
        expect(content).not.toContain('performance.mark');
        expect(content).not.toContain('performance.measure');
      });
    });

    it('should ignore files specified in the configuration', () => {
      const config = {
        ignore: [path.join(testFilesPath, 'file1_temp.js')],
      };
    
      processDirectory(testFilesPath, 'add', config);
    
      const content1 = fs.readFileSync(path.join(testFilesPath, 'file1_temp.js'), 'utf-8');
      expect(content1).not.toContain('performance.mark');
      expect(content1).not.toContain('performance.measure');
    
      const content2 = fs.readFileSync(path.join(testFilesPath, 'file2_temp.js'), 'utf-8');
      expect(content2).toContain('performance.mark');
      expect(content2).toContain('performance.measure');
    
      const content3 = fs.readFileSync(path.join(testFilesPath, 'file3_temp.js'), 'utf-8');
      expect(content3).toContain('performance.mark');
      expect(content3).toContain('performance.measure');
    });           
  });
});   