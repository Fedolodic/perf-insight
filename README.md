# Perf-Insight CLI

Perf-Insight CLI is a command-line tool that allows you to add or remove performance marks and measures from your JavaScript files or entire directories.

## Installation

To install Perf-Insight CLI, use the following command:

```bash
npm install -g perf-insight
```

## Usage

### Adding performance marks and measures

To add performance marks and measures to your JavaScript files, run the following command:

```bash
perf-insight /path/to/your/file.js
```

Or, to process an entire directory:

```bash
perf-insight /path/to/your/directory
```

### Removing performance marks and measures

To remove performance marks and measures from your JavaScript files, use the `--remove` or `-r` option:

```bash
perf-insight --remove /path/to/your/file.js
```

Or, for an entire directory:

```bash
perf-insight --remove /path/to/your/directory
```

## Configuration

Perf-Insight CLI can use a configuration file to ignore specific files or directories. Create a file named `.perfinsightrc` in the root directory of your project with the following content:

```json
{
  "ignore": [
    "path/to/ignored/file.js",
    "path/to/ignored/directory"
  ]
}
```

## Contributing

Contributions to Perf-Insight are welcome! To contribute, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes and commit them to your branch
4. Open a pull request with a description of your changes

Please ensure that your code follows the project's coding style and includes tests for any new functionality.

## License

Perf-Insight is released under the [MIT License](https://opensource.org/licenses/MIT).