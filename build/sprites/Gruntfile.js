/*
 * (c) Copyright Ascensio System SIA 2010-2024
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-6 Ernesta Birznieka-Upish
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
module.exports = function (grunt, rootpathprefix) {
    const sprite_name = 'iconssmall';
    const sprite_name_big = 'iconsbig';
    const sprite_name_huge = 'iconshuge';
    var self = this;

    const helpers = {
        parselang: (name, options) => {
            if (/\((\S+)\)$/.test(name)) {
                let _match = /(.+)\((\S+)\)$/.exec(name);
                return '[applang=' + _match[2] + '] ' + options.fn({name:_match[1]});
            }

            return options.fn({name:name});
        },
        spritepostfix: () => `${opts.extpath ? opts.extpath : 'small'}-${scaling_table[opts.scale]}`,
    };

    const _prefix = rootpathprefix || '../../';
    const scaling_table = {'1x':'100','1.25x':'125','1.5x':'150','1.75x':'175','2x':'200'};
    const configTemplate = opts => {
        let _editor_res_root = `${_prefix}apps/${opts.editor}/main/resources`,
            _common_res_root = `${_prefix}apps/common/main/resources`,
            _scaled_path = `${opts.scale}/${opts.extpath ? opts.extpath : '.'}`;
        const _mod_path = opts.mod2 ? 'v2/' : '';
        let hbhelpers = {...helpers};
        hbhelpers.spritepostfix = () => `${opts.extpath ? opts.extpath : 'small'}-${scaling_table[opts.scale]}`;
        hbhelpers.extracls = () => opts.mod2 ? '.theme-icons-cls-mod2 ' : '';
        hbhelpers.iesupport = () => !opts.mod2;
        hbhelpers.xpsupport = () => !opts.mod2;

        return {
            src: [`${_editor_res_root}/img/toolbar/${_mod_path}${_scaled_path}/*.png`, `${_common_res_root}/img/toolbar/${_mod_path}${_scaled_path}/*.png`],
            dest: `${_editor_res_root}/img/${_mod_path}${opts.scale != '1x' ? opts.spritename + '@' + opts.scale : opts.spritename}.png`,
            destCss: `${_editor_res_root}/less/sprites/${opts.spritename}@${opts.scale}${opts.mod2?'.mod2':''}.less`,
            cssTemplate: `${_common_res_root}/img/toolbar/${_scaled_path}/.css.handlebars`,
            algorithm: 'top-down',
            cssHandlebarsHelpers: hbhelpers
        };
    };

    const configTemplateV2 = opts => {
        let _editor_res_root = `${_prefix}apps/${opts.editor}/main/resources`,
            _common_res_root = `${_prefix}apps/common/main/resources`,
            _scaled_path = `${opts.scale}/${opts.extpath ? opts.extpath : '.'}`;
        let hbhelpers = {...helpers};
        hbhelpers.spritepostfix = () => `${opts.extpath ? opts.extpath : 'small'}-${scaling_table[opts.scale]}`;
        hbhelpers.extracls = () => '.theme-icons-cls-mod2 ';
        return {
            src: [`${_editor_res_root}/img/toolbar/v2/${_scaled_path}/*.png`, `${_common_res_root}/img/toolbar/v2/${_scaled_path}/*.png`],
            dest: `${_editor_res_root}/img/v2/${opts.scale != '1x' ? opts.spritename + '@' + opts.scale : opts.spritename}.png`,
            destCss: `${_editor_res_root}/less/sprites/${opts.spritename}@${opts.scale}.mod2.less`,
            cssTemplate: `${_common_res_root}/img/toolbar/${_scaled_path}/.css.handlebars`,
            algorithm: 'top-down',
            cssHandlebarsHelpers: hbhelpers
        };
    };
    const generate_sprite_tasks = function(editor, mod2=false) {
        const scalings = ['1x','1.25x','1.5x','1.75x','2x'];

        const alias = {"word": "documenteditor",
                        "cell": "spreadsheeteditor",
                        "slide": "presentationeditor",
                        "pdf": "pdfeditor",
                        "draw": "visioeditor"}

        const spritename = {'small': sprite_name,
                            'big': sprite_name_big,
                            'huge' : sprite_name_huge};

        let out = {};

        scalings.forEach((_scaling_) => {
            ['small', 'big', 'huge'].forEach((ext, i) => {
                out[`${editor}${mod2?'-mod2':''}${i?'-'+ext:''}-${_scaling_}`] = configTemplate({
                    editor:`${alias[editor]}`,
                    spritename: spritename[ext],
                    scale: `${_scaling_}`,
                    extpath: i ? ext : '',
                    mod2: mod2,
                })
            });
        });

        return out
    }

    // Single global SVG sprite with all icons from all editors
    const generate_svg_sprite_task = function() {
        return {
            toolbar: {
                src: [
                    `${_prefix}apps/common/main/resources/img/toolbar/2.5x/*.svg`,
                    `${_prefix}apps/common/main/resources/img/toolbar/2.5x/big/*.svg`,
                    `${_prefix}apps/common/main/resources/img/toolbar/2.5x/huge/*.svg`,
                    `${_prefix}apps/*/main/resources/img/toolbar/2.5x/*.svg`,
                    `${_prefix}apps/*/main/resources/img/toolbar/2.5x/big/*.svg`,
                    `${_prefix}apps/*/main/resources/img/toolbar/2.5x/huge/*.svg`,
                ],
                dest: `${_prefix}apps/common/main/resources/img/toolbar/`,
                options: {
                    mode: {
                        symbol: {
                            inline: true,
                            dest: './',
                            sprite: `icons.svg`,
                        },
                    },
                }
            }
        };
    }

    grunt.initConfig({
        // PNG sprites disabled - using SVG sprites only
        // sprite: {
        //     ...generate_sprite_tasks('word'),
        //     ...generate_sprite_tasks('word', mod2=true),
        //     ...generate_sprite_tasks('slide'),
        //     ...generate_sprite_tasks('slide', mod2=true),
        //     ...generate_sprite_tasks('cell'),
        //     ...generate_sprite_tasks('cell', true),
        //     ...generate_sprite_tasks('pdf'),
        //     ...generate_sprite_tasks('pdf', true),
        //     ...generate_sprite_tasks('draw'),
        //     ...generate_sprite_tasks('draw', true),
        // },
        svg_sprite: {
            options: {
                svg: {
                    rootAttributes: {
                        //xmlns:'http://www.w3.org/2000/svg',
                    },
                    namespaceClassnames: false,
                },
                shape: {
                    id: {
                        separator: ""
                    },
                    transform: [{
                        svgo: {
                            plugins: [
                                'removeXMLNS',
                                {
                                    name: "removeAttrs",
                                    params: {
                                      attrs: "(fill|stroke)"
                                    }
                                },
                            ]
                        },
                    }]
                },
                mode: {
                    symbol: {
                    },
                },
            },
            // Single sprite with all toolbar icons
            ...generate_svg_sprite_task(),

            docformats: {
                src: [
                    `${_prefix}apps/common/main/resources/img/doc-formats/*.svg`,
                    `!${_prefix}apps/common/main/resources/img/doc-formats/formats@2.5x.svg`
                ],
                dest: `${_prefix}apps/common/main/resources/img/doc-formats`,
                options: {
                    svg: {
                        rootAttributes: {
                            xmlns:'http://www.w3.org/2000/svg',
                        },
                        dimensionAttributes: false,
                    },
                    mode: {
                        symbol: {
                            inline: false,
                            dest: './',
                            sprite: `formats@2.5x.svg`,
                        },
                    },
                    shape: {
                        id: {
                            separator: ""
                        },
                        transform: [{
                            svgo: {
                                plugins: [
                                    'removeXMLNS',
                                ]
                            },
                        }]
                    },
                }
            },
        },
    });

    // grunt-spritesmith disabled - using SVG sprites only
    // grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-svg-sprite');

    // PNG sprite tasks disabled
    // grunt.registerTask('word-icons', ['sprite:word-1x', ...]);
    // grunt.registerTask('slide-icons', ['sprite:slide-1x', ...]);
    // grunt.registerTask('cell-icons', ['sprite:cell-1x', ...]);
    // grunt.registerTask('pdf-icons', ['sprite:pdf-1x', ...]);
    // grunt.registerTask('draw-icons', ['sprite:draw-1x', ...]);
    // grunt.registerTask('png_sprite', ['sprite']);

    grunt.registerTask('default', ['svg_sprite']);
};