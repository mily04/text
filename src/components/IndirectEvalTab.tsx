import React from 'react';
import { Objective, SurveyItem, SubjectiveEval, ContinuousImprovement, Student, Mapping, Assessment } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  objectives: Objective[];
  surveyItems: SurveyItem[];
  setSurveyItems: (items: SurveyItem[]) => void;
  subjectiveEvals: SubjectiveEval[];
  setSubjectiveEvals: (evals: SubjectiveEval[]) => void;
  continuousImprovement: ContinuousImprovement;
  setContinuousImprovement: (ci: ContinuousImprovement) => void;
  students: Student[];
  mappings: Mapping[];
  assessments: Assessment[];
}

export default function IndirectEvalTab({
  objectives,
  surveyItems,
  setSurveyItems,
  subjectiveEvals,
  setSubjectiveEvals,
  continuousImprovement,
  setContinuousImprovement
}: Props) {

  const handleAddSurveyItem = (objectiveId: string) => {
    const newId = `survey_${Date.now()}`;
    setSurveyItems([
      ...surveyItems,
      {
        id: newId,
        objectiveId,
        description: '',
        weight: 0.5,
        percentages: { excellent: 0, good: 0, medium: 0, pass: 0 }
      }
    ]);
  };

  const handleRemoveSurveyItem = (id: string) => {
    setSurveyItems(surveyItems.filter(item => item.id !== id));
  };

  const handleUpdateSurveyItem = (id: string, field: string, value: any) => {
    setSurveyItems(surveyItems.map(item => {
      if (item.id === id) {
        if (field.startsWith('percentages.')) {
          const subField = field.split('.')[1];
          return { ...item, percentages: { ...item.percentages, [subField]: value } };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleUpdateSubjectiveEval = (objectiveId: string, field: 'qualitativeEval' | 'analysis', value: string) => {
    const existing = subjectiveEvals.find(e => e.objectiveId === objectiveId);
    if (existing) {
      setSubjectiveEvals(subjectiveEvals.map(e => e.objectiveId === objectiveId ? { ...e, [field]: value } : e));
    } else {
      setSubjectiveEvals([...subjectiveEvals, { objectiveId, qualitativeEval: '', analysis: '', [field]: value }]);
    }
  };

  const getSubjectiveEval = (objectiveId: string) => {
    return subjectiveEvals.find(e => e.objectiveId === objectiveId) || { objectiveId, qualitativeEval: '', analysis: '' };
  };

  return (
    <div className="space-y-8">
      {/* 间接定量评价设置 */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">间接定量评价（问卷调查）</h2>
        <p className="text-sm text-slate-500 mb-6">
          为每个课程目标设置调查项目、权重及各档评价百分比（输入百分比数值，如 24.7）。
        </p >

        <div className="space-y-6">
          {objectives.map(obj => {
            const items = surveyItems.filter(item => item.objectiveId === obj.id);
            return (
              <div key={obj.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-medium text-slate-800">{obj.name}</h3>
                  <button
                    onClick={() => handleAddSurveyItem(obj.id)}
                    className="flex items-center px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-xs font-medium shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> 添加调查项目
                  </button>
                </div>
                <div className="p-4 space-y-4 bg-white">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-700 mb-1">调查项目 {index + 1} 描述</label>
                          <textarea
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                            rows={2}
                            value={item.description}
                            onChange={(e) => handleUpdateSurveyItem(item.id, 'description', e.target.value)}
                            placeholder="例如：能够理解和掌握..."
                          />
                        </div>
                        <div className="w-24 shrink-0">
                          <label className="block text-xs font-medium text-slate-700 mb-1">权重 (0~1)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={item.weight}
                            onChange={(e) => handleUpdateSurveyItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveSurveyItem(item.id)}
                          className="mt-6 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除调查项目"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">优 (0.9~1.0) %</label>
                          <input
                            type="number"
                            step="0.1"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={item.percentages.excellent}
                            onChange={(e) => handleUpdateSurveyItem(item.id, 'percentages.excellent', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">良 (0.8~0.9) %</label>
                          <input
                            type="number"
                            step="0.1"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={item.percentages.good}
                            onChange={(e) => handleUpdateSurveyItem(item.id, 'percentages.good', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">中 (0.7~0.8) %</label>
                          <input
                            type="number"
                            step="0.1"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={item.percentages.medium}
                            onChange={(e) => handleUpdateSurveyItem(item.id, 'percentages.medium', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">及格 (0.6~0.7) %</label>
                          <input
                            type="number"
                            step="0.1"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={item.percentages.pass}
                            onChange={(e) => handleUpdateSurveyItem(item.id, 'percentages.pass', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="text-center py-4 text-slate-500 text-sm">暂无调查项目</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 主观定性评价与达成情况分析 */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">主观定性评价与达成情况分析</h2>
        <p className="text-sm text-slate-500 mb-6">
          请针对每个课程目标填写主观定性评价（如座谈会反馈）以及最终的达成情况分析。
        </p >

        <div className="space-y-6">
          {objectives.map(obj => {
            const evalData = getSubjectiveEval(obj.id);
            return (
              <div key={obj.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h3 className="font-medium text-slate-800">{obj.name}</h3>
                </div>
                <div className="p-4 space-y-4 bg-white">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">主观定性评价达成情况</label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      rows={4}
                      value={evalData.qualitativeEval}
                      onChange={(e) => handleUpdateSubjectiveEval(obj.id, 'qualitativeEval', e.target.value)}
                      placeholder="例如：结课座谈会 150 人中有 16 人表示..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">达成情况分析</label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      rows={4}
                      value={evalData.analysis}
                      onChange={(e) => handleUpdateSubjectiveEval(obj.id, 'analysis', e.target.value)}
                      placeholder="例如：本课程目标由期末考试、MOOC 构成，从期末考试达成度可以看出..."
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 持续改进情况 */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">课程目标达成持续改进情况</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">上一年度的提出的改进意见</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              rows={5}
              value={continuousImprovement.previousFeedback}
              onChange={(e) => setContinuousImprovement({ ...continuousImprovement, previousFeedback: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">本年度的改进实施效果</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              rows={5}
              value={continuousImprovement.currentEffect}
              onChange={(e) => setContinuousImprovement({ ...continuousImprovement, currentEffect: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">本年度的问题</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              rows={5}
              value={continuousImprovement.currentProblems}
              onChange={(e) => setContinuousImprovement({ ...continuousImprovement, currentProblems: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">拟在下一年度的改进措施</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              rows={5}
              value={continuousImprovement.futureMeasures}
              onChange={(e) => setContinuousImprovement({ ...continuousImprovement, futureMeasures: e.target.value })}
            />
          </div>
        </div>
      </section>
    </div>
  );
}