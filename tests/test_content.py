"""Standard-library-only regression checks: python3 -m unittest discover -s tests -v."""
import json
import unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
class ContentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.entries = json.loads((ROOT / 'data/catalog.json').read_text(encoding='utf-8'))
    def test_41_entries_unique_ids(self):
        self.assertEqual(len(self.entries), 41)
        self.assertEqual(len({e['id'] for e in self.entries}), 41)
    def test_all_have_concrete_practice_and_caution(self):
        required = ('id','type','title','original','skill','problem','insight','action','caution')
        for item in self.entries:
            for key in required:
                with self.subTest(item=item['id'], field=key):
                    self.assertTrue(str(item[key]).strip())
    def test_type_distribution(self):
        self.assertEqual({t: sum(e['type']==t for e in self.entries) for t in {'电影','电视剧','书籍','纪录片'}}, {'电影':12,'电视剧':10,'书籍':15,'纪录片':4})
    def test_skills(self):
        self.assertEqual({e['skill'] for e in self.entries}, {'职业定位','价值表达','向上管理','边界与谈判','影响力与协作','带队与晋升'})
    def test_js_json_identical(self):
        mirror=(ROOT / 'data/catalog.js').read_text(encoding='utf-8').strip()
        self.assertTrue(mirror.startswith('window.INFJ_CATALOG = ') and mirror.endswith(';'))
        parsed=json.loads(mirror[len('window.INFJ_CATALOG = '):-1])
        self.assertEqual(parsed,self.entries)
    def test_pages_entrypoint(self):
        index=(ROOT / 'index.html').read_text(encoding='utf-8')
        self.assertIn('data/catalog.js',index)
        self.assertIn('app.js',index)
        self.assertIn('style.css',index)
        self.assertIn('https://metaver.vip/services',index)
if __name__ == '__main__': unittest.main()
