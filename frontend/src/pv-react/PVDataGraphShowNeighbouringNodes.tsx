import PVDataGraph from './PVDataGraph';

/***************************
 * UserList Component
 ***************************/
class PVDataGraphShowNeighbouringNodes extends PVDataGraph {
  constructor(props: Readonly<any>) {
    super(props);
  }

  protected getQuery = (eventId: any): { bindings: Record<string, any>; gremlin: string } => {
    this.eventId = eventId;

    let startOfQuery = 'g.V(pg_vid)\n';

    let nodeQuery =
      '  .each{ \n' +
      "    String groupStr = it.values('Metadata.Type').next();\n" +
      "    String labelStr = it.label().toString().replaceAll('[_.]',' ');\n" +
      '    Long vid = it.id();\n' +
      "    sb.append(counter == 0? '{':',{')\n" +
      '      .append(\'"id":\').append(vid)\n' +
      '      .append(\',"group":"\').append(groupStr)\n' +
      '      .append(\'","label":"\').append(labelStr)\n' +
      '      .append(\'","shape":"\').append(\'image\')\n' +
      '      .append(\'","image":"\').append(getPropsNonMetadataAsHTMLTableRows(g,vid,labelStr).toString())\n' +
      "      .append('\"');\n" +
      '    if (vid.equals( pg_vid)){  \n' +
      '      sb.append(\',"fixed":true\');\n' +
      '    } \n' +
      "    sb.append('}')\n" +
      '      \n' +
      '    counter++;\n' +
      '    \n' +
      '  };\n';

    return {
      bindings: {
        pg_vid: eventId,
      },
      gremlin:
        'StringBuffer sb = new StringBuffer();\n' +
        'int counter = 0;\n' +
        '\n' +
        'try {\n' +
        '  \n' +
        'sb.append(\'{ "nodes":[\' );\n' +
        '  \n' +
        startOfQuery +
        '  .both()\n' +
        '  .dedup()\n' +
        nodeQuery +
        // "if (counter == 0){\n" +
        startOfQuery + // Also get the original node
        nodeQuery +
        // "}\n" +
        'sb.append(\'], "edges":[\' )\n' +
        '\n' +
        '\n' +
        'counter = 0;\n' +
        startOfQuery +
        '  .bothE()\n' +
        '  .dedup()' +
        '  .each{ \n' +
        "  sb.append(counter == 0? '{':',{')\n" +
        '    .append(\'"from": \').append(it.inVertex().id())\n' +
        '    .append(\' ,"to": "\').append(it.outVertex().id())\n' +
        "    .append('\",\"label\": \"').append(it.label().toString().replaceAll('[_.]',' '))\n" +
        "    .append('\"}')\n" +
        '    \n' +
        '  counter++;\n' +
        '  \n' +
        '}\n' +
        '\n' +
        "sb.append(']}' );\n" +
        '\n' +
        '\n' +
        '}catch (Throwable t){\n' +
        '  sb.append(t.toString());\n' +
        '}\n' +
        '  \n' +
        'sb.toString()',
    };
  };
}

export default PVDataGraphShowNeighbouringNodes;
