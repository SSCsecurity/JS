const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

const server = new Server(
    { name: 'data-analysis-server', version: '1.0.0' },
    { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'query_data',
            description: 'Query internal data sources',
            inputSchema: {
                type: 'object',
                properties: {
                    query: { type: 'string', description: 'The query to run' }
                },
                required: ['query']
            }
        }
    ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === 'query_data') {
        return { content: [{ type: 'text', text: 'Query result placeholder' }] };
    }
    throw new Error('Unknown tool');
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('MCP server running');
}

main().catch(console.error);
